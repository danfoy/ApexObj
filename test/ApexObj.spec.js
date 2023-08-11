import { use, expect } from 'chai';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
use(chaiLike);
use(chaiThings);
import { set, reset } from 'mockdate';

import seasons from '../src/data/seasons.json' assert { type: 'json' };

import apex from '../dist/index.js';

const season11data = seasons.find(season => season.id === 11);
const season11 = apex.seasons.find(season => season.id === 11);

const season12data = seasons.find(season => season.id === 12);
const season12 = apex.seasons.find(season => season.id === 12);

describe('ApexObj', function() {

  it('throws when Season data not provided', function() {

  });

  describe('.seasons', function() {

    it('returns an array', function() {
      expect(apex.seasons).to.be.an('array');
    });

    it('parses season data', function() {

      // Season 11
      expect(season11.id).to.equal(season11data.id);
      expect(season11.name).to.equal(season11data.name);
      expect(season11.playlists).to.be.an('array');

      // Season 12
      expect(season12.id).to.equal(season12data.id);
      expect(season12.name).to.equal(season12data.name);
      expect(season12.playlists).to.be.an('array');
    });

  });

  describe('.legends property', function() {
    it('is an array', function() {
      expect(apex.legends).to.be.an('array');
    });
  });

  describe('.currentSeason psuedo property', function() {
    it('returns null if no season currently active', function() {
      function check(date) {
        set(date);
        expect(apex.currentSeason).to.be.null;
        reset();
      };

      check('2018-01-01T00:00:00Z');
      check('2100-01-01T00:00:00Z');
    });

    it('returns the current season', function() {
      function check(date, name) {
        set(date);
        expect(apex.currentSeason.name).to.equal(name);
        reset();
      };

      check('2021-11-10T00:00:00Z', 'Escape');
      check('2022-02-10T00:00:00Z', 'Defiance');
    });
  });

  describe('.nextSeason readonly property', function() {
    it('returns the next season if data is available', function() {
      set(season11.startTime);
      expect(apex.nextSeason).to.eql(season12);
      reset()
    });

    it('is null if next season data not available', function() {
      const finalSeason = [...apex.seasons].pop();
      set(finalSeason.startTime);
      expect(apex.nextSeason).to.be.null;
      reset()
    });
  });

  describe('.currentMaps readonly property', function() {
    it('returns null if no season currently active', function() {
      function check(date) {
        set(date);
        expect(apex.currentMaps).to.be.null;
        reset();
      };

      check('2018-01-01T00:00:00Z');
      check('2100-01-01T00:00:00Z');
    });

    it('provides correct values for Season 11', function() {
      function check(date, map, duration) {
        set(date);
        expect(apex.currentMaps)
        .to.contain.something.like({map: map, duration: duration * 60 * 1000});
        reset();
      };

      check('2022-01-11T12:00:00Z',   "World's Edge", 60  )
      check('2022-01-11T13:00:00Z',   "Storm Point",  120 )
      check('2022-01-11T15:00:00Z',   "World's Edge", 120 )
      check('2022-01-11T17:00:00Z',   "Storm Point",  90  )
      check('2022-01-11T18:30:00Z',   "World's Edge", 90  )
      check('2022-01-11T20:00:00Z',   "Storm Point",  120 )
      check('2022-01-11T22:00:00Z',   "World's Edge", 120 )
      check('2022-01-12T00:00:00Z',   "Storm Point",  90  )
      check('2022-01-12T01:30:00Z',   "World's Edge", 90  )
      check('2022-01-12T03:00:00Z',   "Storm Point",  60  )
      check('2022-01-12T04:00:00Z',   "World's Edge", 60  )
    });
  });

  describe('.nextMaps readonly property', function() {
    it('returns null if there is no next season', function() {
      const finalSeason = [...apex.seasons].pop();
      set(finalSeason.endTime);
      expect(apex.nextMaps).to.be.null;
      reset()
    });

    it('returns null if there are no next maps', function() {
      set(season11.endTime - 1000);
      expect(apex.nextMaps).to.be.null;
      reset()
    });

    it('is equal to .currentSeason.nextMaps at the season start', function() {
      set(season12.startTime);
      expect(apex.nextMaps).to.eql(season12.nextMaps);
      reset();
    });
  });

  describe('.currentLTMs readonly property', function() {
    it('is an alias for .currentSeason.currentLTMs', function() {
      set(season12.startTime);
      expect(apex.currentLTMs)
        .to.have.length(2)
        .and.to.eql(season12.currentLTMs);
      reset();
    });
  });

  describe('.currentTakeovers readonly property', function() {
    it('is an alias for .currentSeason.currentTakeovers', function() {
      set(season12.startTime);
      expect(apex.currentTakeovers)
        .to.have.length(1)
        .and.to.eql(season12.currentTakeovers);
      reset();
    });
  });

  describe('.getSeasonByDate() method', function() {
    it('returns null if no season found', function() {
      expect(apex.getSeasonByDate('2000-01-01T00:00:00Z')).to.be.null;
    });

    it('uses the current date if none provided', function() {
      set('2022-02-05T02:00:00Z');
      expect(apex.getSeasonByDate().id).to.equal(11);
      reset();
    });

    it('returns correct seasons at known dates', function() {
      expect(apex.getSeasonByDate('2022-02-05T02:00:00Z').id).to.equal(11);
      expect(apex.getSeasonByDate('2022-03-05T02:00:00Z').id).to.equal(12);
    });
  });

  describe('#getMapsByDate()', function() {
    it('returns correct maps for season 11', function() {

      function check(date, map, duration) {
        return expect(apex.getMapsByDate(date))
          .to.contain.something.like({map: map, duration: duration * 60 * 1000})
      };

      check('2022-01-11T12:00:00Z',   "World's Edge", 60  )
      check('2022-01-11T13:00:00Z',   "Storm Point",  120 )
      check('2022-01-11T15:00:00Z',   "World's Edge", 120 )
      check('2022-01-11T17:00:00Z',   "Storm Point",  90  )
      check('2022-01-11T18:30:00Z',   "World's Edge", 90  )
      check('2022-01-11T20:00:00Z',   "Storm Point",  120 )
      check('2022-01-11T22:00:00Z',   "World's Edge", 120 )
      check('2022-01-12T00:00:00Z',   "Storm Point",  90  )
      check('2022-01-12T01:30:00Z',   "World's Edge", 90  )
      check('2022-01-12T03:00:00Z',   "Storm Point",  60  )
      check('2022-01-12T04:00:00Z',   "World's Edge", 60  )
    })
  })
});
