const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const MockDate = require('mockdate');
const ApexObj = require('../classes/ApexObj');
const apexData = require('../data/seasons.json');
const testObj = new ApexObj(apexData);

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
                    .to.contain.something.like({map: map, duration: duration * 60})
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
