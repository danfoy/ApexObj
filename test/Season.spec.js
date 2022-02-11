const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const MockDate = require('mockdate');
const { isDate } = require('../util');
const Season = require('../classes/Season');

const season11Data = require('../data/seasons.json').seasons[0];
const season11 = new Season(season11Data);

describe('@Season', function() {

    describe('.id property', function() {
        it('returns the season id as a Number', function() {
            expect(season11.id).to.eql(11);
        });
    });

    describe('.name property', function() {
        it('returns the name of the season', function() {
            expect(season11.name).to.equal('Escape');
        })
    });

    describe('.startTime', function() {
        it('returns a Date', function() {
            expect(isDate(season11.startTime)).to.be.true;
        });
    });

    describe('.endTime', function() {
        it('returns a Date', function() {
            expect(isDate(season11.endTime)).to.be.true;
        });
    });

    describe('.playlists', function() {
        it('returns an Array', function() {
            expect(season11.playlists).to.be.an('array');
        });
    });

    describe('.playlists.rotations', function() {
        it('returns an array', function() {
            expect(season11.playlists[0].rotations)
                .to.be.an('array');
        });
    });

    describe('.unranked.battleRoyale getter', function() {
        it('is an alias for unranked Battle Royale mode', function() {
            expect(season11.unranked.battleRoyale).to.eql(season11.playlists[0]);
        });
    });

    describe('.ranked.battleRoyale getter', function() {
        it('is an alias for ranked Battle Royale mode', function() {
            expect(season11.ranked.battleRoyale).to.eql(season11.playlists[1]);
        });
    });

    describe('.currentMaps getter', function() {
        it('returns an array', function() {
            MockDate.set('2022-02-04T12:44:00Z');
            expect(season11.currentMaps).to.be.an('array');
            MockDate.reset();
        });

        it('returns correct results for Season 11', function() {

            function check(date, map, duration) {
                MockDate.set(date);
                expect(season11.currentMaps)
                    .to.contain.something.like({map: map, duration: duration * 60 * 1000});
                MockDate.reset();
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

    describe('.getMapsByDate() method', function() {
        it('returns correct maps for season 11', function() {

            function check(date, map, duration) {
                return expect(season11.getMapsByDate(date))
                    .to.contain.something.like({map: map, duration: duration * 60 * 1000});
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

});
