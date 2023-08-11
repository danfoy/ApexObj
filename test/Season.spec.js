import { describe, it } from 'mocha';
import { use, expect } from 'chai';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
use(chaiLike);
use(chaiThings);
import { set, reset } from 'mockdate';
import { isDate } from '../dist/util/date.js';
import SplitPlaylist from '../dist/classes/SplitPlaylist.js';
import RotatingPlaylist from '../dist/classes/RotatingPlaylist.js';

import apex from '../dist/index.js';

const season11 = apex.seasons.find((season) => season.id === 11);
const season11BR = season11.playlists.find(
  (playlist) => playlist.mode === 'Play Apex',
);
const season11RankedBR = season11.playlists.find(
  (playlist) => playlist.mode === 'Ranked Leagues',
);

const season12 = apex.seasons.find((season) => season.id === 12);

describe('Season', function () {
  describe('.id', function () {
    it('returns the season id as a Number', function () {
      expect(season11.id).to.equal(11);
    });
  });

  describe('.name', function () {
    it('returns the name of the season', function () {
      expect(season11.name).to.equal('Escape');
    });
  });

  describe('.startTime', function () {
    it('returns a Date', function () {
      expect(isDate(season11.startTime)).to.be.true;
    });
  });

  describe('.endTime', function () {
    it('returns a Date', function () {
      expect(isDate(season11.endTime)).to.be.true;
    });
  });

  describe('.playlists', function () {
    it('returns an Array', function () {
      expect(season11.playlists).to.be.an('array');
    });
  });

  describe('.playlists.rotations', function () {
    it('returns an array', function () {
      expect(season11BR.rotations).to.be.an('array');
    });
  });

  describe('.unranked.battleRoyale readonly property', function () {
    it('is an alias for unranked Battle Royale mode', function () {
      expect(season11.unranked.battleRoyale).to.eql(season11BR);
    });
  });

  describe('.ranked.battleRoyale readonly property', function () {
    it('is an alias for ranked Battle Royale mode', function () {
      expect(season11.ranked.battleRoyale).to.eql(season11RankedBR);
    });
  });

  describe('.currentPlaylists readonly property', function () {
    it('aliases .getPlaylistsByDate(<current Date>)', function () {
      set(season12.startTime);
      expect(season12.currentPlaylists).to.eql(
        season12.getPlaylistsByDate(season12.startTime),
      );
      reset();
    });
  });

  describe('.currentMaps readonly property', function () {
    it('returns an array', function () {
      set('2022-02-04T12:44:00Z');
      expect(season11.currentMaps).to.be.an('array');
      reset();
    });

    it('returns correct results for Season 11', function () {
      function check(date, map, duration) {
        set(date);
        expect(season11.currentMaps).to.contain.something.like({
          map: map,
          duration: duration * 60 * 1000,
        });
        reset();
      }

      check('2022-01-11T12:00:00Z', "World's Edge", 60);
      check('2022-01-11T13:00:00Z', 'Storm Point', 120);
      check('2022-01-11T15:00:00Z', "World's Edge", 120);
      check('2022-01-11T17:00:00Z', 'Storm Point', 90);
      check('2022-01-11T18:30:00Z', "World's Edge", 90);
      check('2022-01-11T20:00:00Z', 'Storm Point', 120);
      check('2022-01-11T22:00:00Z', "World's Edge", 120);
      check('2022-01-12T00:00:00Z', 'Storm Point', 90);
      check('2022-01-12T01:30:00Z', "World's Edge", 90);
      check('2022-01-12T03:00:00Z', 'Storm Point', 60);
      check('2022-01-12T04:00:00Z', "World's Edge", 60);
    });
  });

  describe('.nextMaps readonly property', function () {
    it('returns null at end of season', function () {
      set(season12.endTime);
      expect(season12.nextMaps).to.be.null;
      reset();
    });

    it('returns an array without null elements if data available', function () {
      set('2022-02-14T16:00:00Z');
      expect(season12.nextMaps).to.be.an('array');
      expect(season12.nextMaps).to.not.include(null);
      reset();
    });

    it('returns the replaced mode during takeovers', function () {
      // When Olympus 24/7 takeover is happening
      set('2022-02-14T16:00:00Z');

      // confirm LTM is active
      expect(
        season12.currentMaps.filter((map) => map.mode === 'Olympus 24/7'),
      ).to.have.length(1);

      // Check nextmap returns to regular mode and doesn't include the LTM
      expect(
        season12.nextMaps.filter((map) => map.mode === 'Play Apex'),
      ).to.have.length(1);
      expect(
        season12.nextMaps.filter((map) => map.mode === 'Olympus 24/7'),
      ).to.have.length(0);
      reset();
    });
  });

  describe('.currentLTMs readonly property', function () {
    it('is null if there is not a current Limited Time Mode', function () {
      // No LTMs in season11 data
      set(season11.startTime);
      expect(season11.currentLTMs).to.be.null;
      reset();

      // No LTM 3 weeks into season 12
      set(season12.startTime.getTime() + 1000 * 60 * 60 * 24 * 7 * 3);
      expect(season12.currentLTMs).to.be.null;
      reset();
    });

    it('returns the correct number of current LTM playlist(s)', function () {
      set(season12.startTime);
      expect(season12.currentLTMs).to.have.length(2);
      reset();
    });
  });

  describe('.currentTakeovers readonly property', function () {
    it('is null if there is not a current takeover LTM', function () {
      // No LTMs in season11 data
      set(season11.startTime);
      expect(season11.currentTakeovers).to.be.null;
      reset();

      // No LTM 3 weeks into season 12
      set(season12.startTime.getTime() + 1000 * 60 * 60 * 24 * 7 * 3);
      expect(season12.currentTakeovers).to.be.null;
      reset();
    });

    it('returns the correct number of current takeover LTM playlist(s)', function () {
      set(season12.startTime);
      expect(season12.currentTakeovers).to.have.length(1);
      reset();
    });
  });

  describe('#parsePlaylist(playlistData)', function () {
    it('parses ranked playlists', function () {
      expect(season11RankedBR instanceof SplitPlaylist).to.be.true;
      expect(season11RankedBR instanceof RotatingPlaylist).to.be.false;
    });

    it('parses unranked playlists', function () {
      expect(season11BR instanceof RotatingPlaylist).to.be.true;
      expect(season11BR instanceof SplitPlaylist).to.be.false;
    });
  });

  describe('#getPlaylistsByDate(date)', function () {
    it('returns null when no playlists available', function () {
      expect(season12.getPlaylistsByDate(season12.startTime - 1000)).to.be.null;
      expect(season12.getPlaylistsByDate(season12.endTime + 1000)).to.be.null;
    });

    it('uses the current date if none provided', function () {
      set(season12.startTime);
      expect(season12.getPlaylistsByDate()).to.eql(
        season12.getPlaylistsByDate(season12.startTime),
      );
      reset();
    });

    it('returns correct results for season 12', function () {
      expect(season12.getPlaylistsByDate(season12.startTime))
        .to.contain.something.like({ mode: 'Control' })
        .and.contain.something.like({ mode: 'Ranked Leagues' })
        .and.contain.something.like({ mode: 'Olympus 24/7' })
        .and.not.contain.something.like({ mode: 'Play Apex' });
    });
  });

  describe('#getMapsByDate()', function () {
    it('uses the current date if none provided', function () {
      set(season12.startTime);
      expect(season12.getMapsByDate()).to.eql(
        season12.getMapsByDate(season12.startTime),
      );
      reset();
    });

    it('returns null if outside season date boundaries', function () {
      expect(season12.getMapsByDate(season12.startTime - 1000)).to.be.null;
      expect(season12.getMapsByDate(season12.endTime + 1000)).to.be.null;
    });

    it('returns correct maps for season 11', function () {
      function check(date, map, duration) {
        return expect(
          season11
            .getMapsByDate(date)
            .filter((map) => map.mode === 'Play Apex'),
        ).to.contain.something.like({
          map: map,
          duration: duration * 60 * 1000,
        });
      }

      check('2022-01-11T12:00:00Z', "World's Edge", 60);
      check('2022-01-11T13:00:00Z', 'Storm Point', 120);
      check('2022-01-11T15:00:00Z', "World's Edge", 120);
      check('2022-01-11T17:00:00Z', 'Storm Point', 90);
      check('2022-01-11T18:30:00Z', "World's Edge", 90);
      check('2022-01-11T20:00:00Z', 'Storm Point', 120);
      check('2022-01-11T22:00:00Z', "World's Edge", 120);
      check('2022-01-12T00:00:00Z', 'Storm Point', 90);
      check('2022-01-12T01:30:00Z', "World's Edge", 90);
      check('2022-01-12T03:00:00Z', 'Storm Point', 60);
      check('2022-01-12T04:00:00Z', "World's Edge", 60);
    });

    it('returns correct maps for season 12', function () {
      function check(date, map, duration) {
        return expect(
          season12
            .getMapsByDate(date)
            .filter((map) => map.mode === 'Play Apex'),
        ).to.contain.something.like({
          map: map,
          duration: duration * 60 * 1000,
        });
      }

      check('2022-02-16T12:30:00Z', 'Storm Point', 90);
      check('2022-02-16T14:00:00Z', 'Olympus', 120);
      check('2022-02-16T16:00:00Z', "King's Canyon", 120);
      check('2022-02-16T18:00:00Z', 'Storm Point', 120);
      check('2022-02-16T20:00:00Z', 'Olympus', 90);
      check('2022-02-16T21:30:00Z', "King's Canyon", 90);
      check('2022-02-16T23:00:00Z', 'Storm Point', 90);
    });

    it('returns correct LTM values for Season 12', function () {
      // Shows the Control LTM when in date
      expect(
        season12
          .getMapsByDate('2022-02-14T01:00:00Z')
          .filter((map) => map.mode === 'Control'),
      ).to.have.length(1);

      // Doesn't show Control after Control finish date
      expect(
        season12
          .getMapsByDate('2022-03-03T01:00:00Z')
          .filter((map) => map.mode === 'Control'),
      ).to.have.length(0);

      // Includes the Olympus 24/7 event when active
      expect(
        season12
          .getMapsByDate('2022-02-14T01:00:00Z')
          .filter((map) => map.mode === 'Olympus 24/7'),
      ).to.have.length(1);

      // Doesn't include Play Apex mode when not active
      expect(
        season12
          .getMapsByDate('2022-02-14T01:00:00Z')
          .filter((map) => map.mode === 'Play Apex'),
      ).to.have.length(0);
    });
  });
});
