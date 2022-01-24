const { expect } = require('chai');
const { isDate, parseDate } = require('../util');
const ApexSeason = require('../classes/ApexSeason');

const season11Data = require('../data/seasons.json').seasons[0];
const season11 = new ApexSeason(season11Data);

describe('@ApexSeason', function() {

    // This entry was reporting -972 minutes remaining
    // The offset is 960. Appears to be a bug with currentMap() getter.
    // Will need to build a schedule array that includes timeRemaining to test.
    // I believe the actual fix is for timeRemaining to be calculated by
    // subtracting the offset from the playlist total duration if the current
    // implementation is less than 0/it is the last index in playlist.
    // it('this unknown error', function() {
    //     const seasonData = {
    //         id: 11,
    //         name: 'Escape',
    //         maps: ["Storm Point", "World's Edge"],
    //         mapDurations: [90, 60, 60, 120, 90, 120],
    //         startTime: "2021-11-02T12:00:00Z",
    //         endTime: "2022-02-08T12:00:00Z",
    //     };
    //     console.log(new ApexSeason(seasonData).getMapByDate(new Date('2022-01-17T04:12:00Z')));
    //     expect(new ApexSeason(seasonData).getMapByDate(new Date('2022-01-17T04:12:00Z')).timeRemaining)
    //         .to.be.gt(0);
    // });

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

    describe('.queryDate', function() {
        it('accepts a date passed as an argument', function() {
            const targetDate = new Date('2022-01-20T03:00:00Z');
            expect(new ApexSeason(season11Data, targetDate).queryDate)
                .to.eql(targetDate);
        });

        it('accepts an ISO date string passed as an argument', function() {
            const targetDate =new Date('2022-01-20T03:00:00Z');
            expect(new ApexSeason(season11Data, '2022-01-20T03:00:00Z').queryDate)
                .to.eql(targetDate);
        })

        it('is the current date by default', function() {
            // Allowing some time either side for test processing
            const lowerLimit = new Date().valueOf() - 50;
            const upperLimit = new Date().valueOf() + 50;
            const queryDateResult = new Date(season11.queryDate).valueOf();
            expect(queryDateResult).to.be.gt(lowerLimit).and.lt(upperLimit);
        });
    });

    describe('.unranked.battleRoyale', function() {
        it('is an alias for unranked Battle Royale mode', function() {
            expect(season11.unranked.battleRoyale).to.eql(season11.playlists[0]);
        });
    });

});
