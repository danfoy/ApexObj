const { expect } = require('chai');
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
});
