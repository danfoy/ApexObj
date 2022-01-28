const { expect } = require('chai');
const ApexObj = require('../classes/ApexObj');
const apexData = require('../data/seasons.json');

describe('@ApexObj', function() {

    it('throws if season data not provided', function() {
        expect(()=>new ApexObj()).to.throw();
    });

    const testData = {
        seasons: [
            {
                id: 11,
                name: "Escape",
                playlists: [
                    {
                        mode: "Battle Royale",
                        ranked: false,
                        maps: ["Storm Point", "World's Edge"],
                        mapDurations: [90, 60, 60, 120, 90, 120]
                    }
                ],
                startTime: "2021-11-02T12:00:00Z",
                endTime: "2022-02-08T12:00:00Z"
            },
            {
                id: 12,
                name: "Defiance",
                playlists: [
                    {
                        mode: "Battle Royale",
                        ranked: false,
                        maps: ["Storm Point", "World's Edge", "Olympus"],
                        mapDurations: [90, 60, 60, 120, 90, 120]
                    }
                ],
                startTime: "2022-02-08T12:00:00Z",
                endTime: "2022-05-03T12:00:00Z"
            }
        ]
    }

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
