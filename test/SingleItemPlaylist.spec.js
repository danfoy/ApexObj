import { describe, it } from 'mocha';
import { expect } from 'chai';
import { set, reset } from 'mockdate';

import SingleItemPlaylist from '../dist/classes/SingleItemPlaylist.js';
import Season from '../dist/classes/Season.js';

import apex from '../dist/index.js';
import seasonData from '../dist/data/seasons.json' assert { type: 'json' };

// const season12Data = seasonData.find(season => season.id === 12);
const season12 = apex.seasons.find((season) => season.id === 12);
// const olympus247Data = season12Data.LTMs.find(ltm => ltm.mode === "Olympus 24/7");
const olympus247 = season12.playlists.find(
  (playlist) => playlist.mode === 'Olympus 24/7',
);

describe('SingleItemPlaylist', function () {
  describe('.rotations', function () {
    it('returns an array with a single entry', function () {
      expect(olympus247.rotations.length).to.equal(1);
    });
  });

  describe('.currentMap readonly property', function () {
    it('returns the map when within date bounds', function () {
      set(olympus247.startTime + 30);
      expect(olympus247.currentMap.map).to.equal('Olympus');
      reset();
    });

    it('returns null when outside of date bounds', function () {
      // Before start time
      set(olympus247.startTime.getTime() - 30);
      expect(olympus247.currentMap).to.be.null;
      reset();

      // After end time
      set(olympus247.endTime.getTime() + 4000);
      expect(olympus247.currentMap).to.be.null;
      reset();
    });
  });

  describe('.nextMap readonly property', function () {
    it('returns the map when before playlist startTime', function () {
      set(olympus247.startTime - 30);
      expect(olympus247.nextMap.map).to.equal('Olympus');
      reset();
    });

    it('returns null if after playlist startTime', function () {
      set(olympus247.startTime + 30);
      expect(olympus247.nextMap).to.be.null;
      reset();
    });
  });

  describe('#getMapByDate(date)', function () {
    it('throws if an invalid date is provided', function () {
      expect(() => olympus247.getMapByDate('zzz')).to.throw();
    });

    it('uses the current date if date not provided', function () {
      set(olympus247.startTime);
      const implicitMap = olympus247.getMapByDate();
      reset();
      const explicitMap = olympus247.getMapByDate(olympus247.startTime);
      expect(implicitMap).to.eql(explicitMap);
    });

    it('returns null if before/after the playlist start/end', function () {
      // Before start time
      expect(olympus247.getMapByDate(olympus247.startTime.getTime() - 30)).to.be
        .null;
      expect(olympus247.getMapByDate(olympus247.endTime.getTime() + 30)).to.be
        .null;
    });
  });
});
