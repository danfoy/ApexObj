const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const MockDate = require('mockdate');
const ApexObj = require('../classes/ApexObj');
const apexData = require('../data/seasons.json');

const testObj = new ApexObj(apexData);
const season11 = testObj.seasons.find(season => season.id === 11);
const season12 = testObj.seasons.find(season => season.id === 12);

describe('@ApexObj', function() {

    it('throws if season data not provided', function() {
        expect(()=>new ApexObj()).to.throw();
    });

    describe('.seasons', function() {

        it('returns an array', function() {
            expect(testObj.seasons).to.be.an('array');
        });

        it('parses season data', function() {

            // Season 11
            expect(testObj.seasons[0].id).to.equal(11);
            expect(testObj.seasons[0].name).to.equal('Escape');
            expect(testObj.seasons[0].playlists).to.be.an('array');

            // Season 12
            expect(testObj.seasons[1].id).to.equal(12);
            expect(testObj.seasons[1].name).to.equal('Defiance');
            expect(testObj.seasons[1].playlists).to.be.an('array');
        });

    });

    describe('.currentSeason', function() {
        it('returns null if no season currently active', function() {
            function check(date) {
                MockDate.set(date);
                expect(testObj.currentSeason).to.be.null;
                MockDate.reset();
            };

            check('2018-01-01T00:00:00Z');
            check('2100-01-01T00:00:00Z');
        });

        it('returns the current season', function() {
            function check(date, name) {
                MockDate.set(date);
                expect(testObj.currentSeason.name).to.equal(name);
                MockDate.reset();
            };

            check('2021-11-10T00:00:00Z', 'Escape');
            check('2022-02-10T00:00:00Z', 'Defiance');
        });
    });

    describe('.nextSeason computed property', function() {
        it('returns the next season if data is available', function() {
            MockDate.set(season11.startTime);
            expect(testObj.nextSeason).to.eql(season12);
            MockDate.reset()
        });

        it('is null if next season data not available', function() {
            const finalSeason = [...testObj.seasons].pop();
            MockDate.set(finalSeason.startTime);
            expect(testObj.nextSeason).to.be.null;
            MockDate.reset()
        });
    });

    describe('.currentMaps getter', function() {
        it('returns null if no season currently active', function() {
            function check(date) {
                MockDate.set(date);
                expect(testObj.currentMaps).to.be.null;
                MockDate.reset();
            };

            check('2018-01-01T00:00:00Z');
            check('2100-01-01T00:00:00Z');
        });

        it('provides correct values for Season 11', function() {
            function check(date, map, duration) {
                MockDate.set(date);
                expect(testObj.currentMaps)
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

    describe('.currentLTMs computed property', function() {
        it('is an alias for .currentSeason.currentLTMs', function() {
            MockDate.set(season12.startTime);
            expect(testObj.currentLTMs)
                .to.have.length(2)
                .and.to.eql(season12.currentLTMs);
            MockDate.reset();
        });
    });

    describe('.currentTakeovers computed property', function() {
        it('is an alias for .currentSeason.currentTakeovers', function() {
            MockDate.set(season12.startTime);
            expect(testObj.currentTakeovers)
                .to.have.length(1)
                .and.to.eql(season12.currentTakeovers);
            MockDate.reset();
        });
    });

    describe('.getSeasonByDate() method', function() {
        it('returns null if no season found', function() {
            expect(testObj.getSeasonByDate('2000-01-01T00:00:00Z')).to.be.null;
        });

        it('uses the current date if none provided', function() {
            MockDate.set('2022-02-05T02:00:00Z');
            expect(testObj.getSeasonByDate().id).to.equal(11);
            MockDate.reset();
        });

        it('returns correct seasons at known dates', function() {
            expect(testObj.getSeasonByDate('2022-02-05T02:00:00Z').id).to.equal(11);
            expect(testObj.getSeasonByDate('2022-03-05T02:00:00Z').id).to.equal(12);
        });
    });

    describe('.getMapsByDate() method', function() {
        it('returns correct maps for season 11', function() {

            function check(date, map, duration) {
                return expect(testObj.getMapsByDate(date))
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
