const { expect } = require('chai');
const { isDate, parseDate } = require('../util');
const ApexSeason = require('../classes/ApexSeason');

const seasonData = {
    id: 11,
    name: 'Escape',
    maps: ["Storm Point", "World's Edge"],
    mapDurations: [90, 60, 60, 120, 90, 120],
    startTime: "2021-11-02T12:00:00Z",
    endTime: "2022-02-08T12:00:00Z",
};

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

    describe('.id', function() {
        it('returns the season id as a Number', function() {
            expect(new ApexSeason(seasonData).id).to.eql(11);
        });
    });

    describe('.maps', function() {
        it("returns an Array of this season's maps", function() {
            expect(new ApexSeason(seasonData).maps).to.eql(["Storm Point", "World's Edge"]);
        });
    });

    describe('.mapDurations', function() {
        it("returns an Array of this season's map durations", function() {
            expect(new ApexSeason(seasonData).mapDurations).to.eql([90, 60, 60, 120, 90, 120]);
        });
    });

    describe('.startTime', function() {
        it('returns a Date', function() {
            expect(isDate(new ApexSeason(seasonData).startTime)).to.be.true;
        });
    });

    describe('.endTime', function() {
        it('returns a Date', function() {
            expect(isDate(new ApexSeason(seasonData).endTime)).to.be.true;
        });
    });

    describe('.playlist', function() {
        it('returns an array', function() {
            expect(new ApexSeason(seasonData).playlist)
                .to.be.an('array');
        });
    });

    describe('.queryDate', function() {
        it('accepts a date passed as an argument', function() {
            const targetDate = new Date('2022-01-20T03:00:00Z');
            expect(new ApexSeason(seasonData, targetDate).queryDate)
                .to.eql(targetDate);
        });

        it('accepts an ISO date string passed as an argument', function() {
            const targetDate =new Date('2022-01-20T03:00:00Z');
            expect(new ApexSeason(seasonData, '2022-01-20T03:00:00Z').queryDate)
                .to.eql(targetDate);
        })

        it('is the current date by default', function() {
            // Allowing some time either side for test processing
            const lowerLimit = new Date().valueOf() - 50;
            const upperLimit = new Date().valueOf() + 50;
            const queryDateResult = new Date(new ApexSeason(seasonData).queryDate).valueOf();
            expect(queryDateResult).to.be.gt(lowerLimit).and.lt(upperLimit);
        });
    });

    it("provides correct values for Season 11 'Escape'", function() {

        const seasonData = {
            id: 11,
            name: 'Escape',
            maps: ["Storm Point", "World's Edge"],
            mapDurations: [90, 60, 60, 120, 90, 120],
            startTime: "2021-11-02T12:00:00Z",
            endTime: "2022-02-08T12:00:00Z",
        };

        function check(_date, _map, _duration) {
            return expect(new ApexSeason(seasonData, parseDate(_date)).currentMap)
                .to.include({map: _map, duration: _duration});
        };

        check('2022-01-11T12:00:00Z', "World's Edge", 60)
        check('2022-01-11T13:00:00Z', "Storm Point", 120)
        check('2022-01-11T15:00:00Z', "World's Edge", 120)
        check('2022-01-11T17:00:00Z', "Storm Point", 90)
        check('2022-01-11T18:30:00Z', "World's Edge", 90)
        check('2022-01-11T20:00:00Z', "Storm Point", 120)
        check('2022-01-11T22:00:00Z', "World's Edge", 120)
        check('2022-01-12T00:00:00Z', "Storm Point", 90)
        check('2022-01-11T01:30:00Z', "World's Edge", 90)
        check('2022-01-12T03:00:00Z', "Storm Point", 60)
        check('2022-01-12T04:00:00Z', "World's Edge", 60)

        // Half an hour into a map rotation
        check('2022-01-11T12:30:00Z', "World's Edge", 60)
    });

});
