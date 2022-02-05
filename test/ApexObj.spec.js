const { expect } = require('chai');
const ApexObj = require('../classes/ApexObj');
const apexData = require('../data/seasons.json');
const testData = apexData;

describe('@ApexObj', function() {

    it('throws if season data not provided', function() {
        expect(()=>new ApexObj()).to.throw();
    });

    describe('.seasons', function() {
        const testObj = new ApexObj(testData);

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
});
