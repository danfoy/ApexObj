const { expect } = require('chai');
const MockDate = require('mockdate');
const Season = require('../classes/Season');
const Playlist = require('../classes/Playlist');
const { parseDate } = require('../util');

describe('@Playlist', function() {

    const apexData = require('../data/seasons.json');
    const season11PlaylistData = apexData.seasons[0].playlists[0];
    const season11 = new Season(apexData.seasons[0]);
    const season11Playlist = new Playlist(season11PlaylistData, season11);

    function getPlaylist(data) {
        return new Playlist(data, new Season(apexData.seasons[0], season11));
    };

    it('throws if not provided with required ApexSeason properties', function() {
        expect(()=>new Playlist({})).to.throw
    });

    describe('.mode property', function() {
        it('returns the mode', function() {
            expect(season11Playlist.mode).to.equal("Battle Royale");
        });
    });

    describe('.ranked property', function() {
        it('returns whether or not the mode is ranked', function() {
            expect(season11Playlist.ranked).to.be.false;
        })
    })

    describe('.maps property', function() {
        it("returns an Array of this season's maps", function() {
            expect(season11Playlist.maps).to.eql(["Storm Point", "World's Edge"]);
        });
    });

    describe('.mapDurations property', function() {
        it("returns an Array of this season's map durations converted to seconds", function() {
            const offsetsInSeconds = [90, 60, 60, 120, 90, 120].map(offset => offset * 60);
            expect(season11Playlist.mapDurations).to.eql(offsetsInSeconds);
        });
    });

    describe('.rotations property', function() {
        it('.rotations property', function() {
            expect(season11Playlist.rotations)
                .to.be.an('array');
        });
    });

    describe('.rotationBaseDate getter', function() {
        it('returns a date object set to midday', function() {
            expect(season11Playlist.rotationBaseTime.getUTCHours()).to.equal(12);
        });
    });

    describe('.totalDuration getter', function() {
        it('returns the total playlist duration', function() {
            expect(season11Playlist.playlistRotationsDuration).to.equal(1080 * 60);
        });
    });

    describe('.currentIndex getter', function() {

        function check(date, index) {
            MockDate.set(date);
            expect(season11Playlist.currentIndex)
            .to.equal(index);
            MockDate.reset();
        };

        it('returns the current playlist index', function() {
            // First rotation of the season
            check('2021-11-02T12:00:00Z', 0);
            check('2021-11-03T04:00:00Z', 11);
        });

        it('returns correct responses for season 11', function() {
            check('2022-01-11T12:00:00Z', 5 );
            check('2022-01-11T13:00:00Z', 6 );
            check('2022-01-11T15:00:00Z', 7 );
            check('2022-01-11T17:00:00Z', 8 );
            check('2022-01-11T18:30:00Z', 9 );
            check('2022-01-11T20:00:00Z', 10);
            check('2022-01-11T22:00:00Z', 11);
            check('2022-01-12T00:00:00Z', 0 );
            check('2022-01-12T01:30:00Z', 1 );
            check('2022-01-12T03:00:00Z', 2 );
            check('2022-01-12T04:00:00Z', 3 );
        });
    });

    describe('.currentMap getter', function() {

        it('returns null when out of season', function() {
            MockDate.set(new Date(season11Playlist.startTime.getTime() - 1000));
            expect(season11Playlist.currentMap).to.be.null;
            MockDate.reset();

            MockDate.set(new Date(season11Playlist.endTime.getTime() + 1000));
            expect(season11Playlist.currentMap).to.be.null;
            MockDate.reset();
        });

        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, mapName, duration) {
                MockDate.set(date);
                const testMap = season11Playlist.currentMap;
                const testStartTime = new Date(date);
                const testEndTime = new Date( new Date(date).getTime() + ((duration * 60 * 1000) - 1));

                // Map and duration properties can be tested simply
                expect(testMap).to.include({
                    map: mapName,
                    duration: duration * 60,
                });

                console.log(`Map data for ${date}:`, testMap);
                console.log(`Time remaining:`, testMap.timeRemaining);

                // Dates must be compared using strict equality
                expect(testMap.startTime).to.eql(testStartTime);
                expect(testMap.endTime).to.eql(testEndTime);

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
            // Half an hour into a map rotation
            // check('2022-01-11T12:30:00Z', "World's Edge", 60)
        });
    });

    describe('.nextMap getter', function() {

        it('returns null if after season end', function() {
            // After season ends
            const afterSeason = new Date(season11Playlist.endTime.getTime() + 1000);
            MockDate.set(afterSeason);
            expect(season11Playlist.nextMap).to.be.null;
            MockDate.reset();

            // during the last season rotation
            const duringLastRotation = new Date(season11Playlist.endTime.getTime() - (1000 * 60 * 30));
            MockDate.set(duringLastRotation);
            expect(season11Playlist.nextMap).to.be.null;
            MockDate.reset();
        });

        // it('returns the first rotation if before season start', function() {
        //     MockDate.set(season11Playlist.startTime.getTime() - 100000);
        //     expect(season11Playlist.nextMap).to.eql(season11Playlist.getMapByDate(season11Playlist.startTime));
        //     MockDate.reset()
        // });

        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, mapName, duration) {
                const durationInSeconds = duration * 60;
                MockDate.set(date);
                expect(new Playlist(season11PlaylistData, new Season(apexData.seasons[0])).nextMap)
                    .to.include({map: mapName, duration: durationInSeconds});
                MockDate.reset();
            };

            check('2022-01-11T12:00:00Z',   "Storm Point",  120 )
            check('2022-01-11T13:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T15:00:00Z',   "Storm Point",  90  )
            check('2022-01-11T17:00:00Z',   "World's Edge", 90  )
            check('2022-01-11T18:30:00Z',   "Storm Point",  120 )
            check('2022-01-11T20:00:00Z',   "World's Edge", 120 )
            check('2022-01-11T22:00:00Z',   "Storm Point",  90  )
            check('2022-01-12T00:00:00Z',   "World's Edge", 90  )
            check('2022-01-12T01:30:00Z',   "Storm Point",  60  )
            check('2022-01-12T03:00:00Z',   "World's Edge", 60  )
            check('2022-01-12T04:00:00Z',   "Storm Point",  60  )
        });
    });

    describe('.getIndexByOffset(minutes) method', function() {
        it('gets the rotation index by the given time offset', function() {
            function check(offset, index) {
                const offsetInSeconds = offset * 60;
                return expect(season11Playlist.getIndexByOffset(offsetInSeconds)).to.equal(index);
            };

            check(0,    0   );
            check(90,   1   );
            check(180,  2   );
            check(240,  3   );
            check(300,  4   );
            check(360,  5   );
            check(420,  6   );
            check(540,  7   );
            check(660,  8   );
            check(750,  9   );
            check(840,  10  );
            check(960,  11  );
        });
    });

    describe('.getOffsetByIndex(index) method', function() {
        it('gets the minutes offset from the playlist start for the map at the given index', function() {
            function check(index, offset) {
                const offsetInSeconds = offset * 60;
                return expect(season11Playlist.getOffsetByIndex(index)).to.equal(offsetInSeconds);
            };

            check(0, 0);
            check(1, 90);
            check(2, 180);
            check(11, 960);
            check(13, 90);
        });
    });

    describe('normaliseIndex(index) method', function() {
        function check(index, normalised) {
            return expect(season11Playlist.normaliseIndex(index)).to.equal(normalised);
        }
        it("returns the input index if it won't overflow the playlist", function() {
            check(0, 0);
            check(1, 1);
            check(11, 11);
        });

        it('returns a looped index if input index would overflow the playlist', function() {
            check(12, 0);
            check(13, 1);
            check(24, 0);
        });
    });

    describe('.getPlaylistTimeElapsed(date) method', function() {
        it('returns the time elapsed in this playlist rotation', function() {
            expect(season11Playlist.getPlaylistTimeElapsed('2022-01-24T02:00:00Z'))
                .to.equal(120 * 60);
        });
    });

    describe('.getMapByDate(date) method', function() {

        it('throws if the provided date is invalid', function() {
            expect(()=>season11Playlist.getMapByDate('zzz')).to.throw()
            expect(()=>season11Playlist.getMapByDate('2022-01-28T03:00:00Z'))
                .to.not.throw();
        });

        it('uses the current date if none provided', function() {
            MockDate.set('2022-01-11T12:00:00Z');
            expect(new Playlist(
                season11PlaylistData,
                new Season(apexData.seasons[0]))
                    .getMapByDate())
                    .to.include({map: "World's Edge", duration: 60 * 60});
            MockDate.reset();
        });

        it('returns null if date out of bounds', function() {
            const beforeSeason = new Date(season11Playlist.startTime.getTime() - 1000);
            const afterSeason = new Date(season11Playlist.endTime.getTime() + 1000);
            expect(season11Playlist.getMapByDate(beforeSeason)).to.be.null;
            expect(season11Playlist.getMapByDate(afterSeason)).to.be.null;
        });

        it('returns correct maps for Season 11', function() {

            function check(date, mapName, duration) {
                const testPlaylist = new Playlist(season11PlaylistData, new Season(apexData.seasons[0])).getMapByDate(date);
                const testStartTime = new Date(date);
                const testEndTime = new Date( new Date(date).getTime() + ((duration * 60 * 1000) - 1));

                // Map and duration properties can be tested simply
                expect(testPlaylist).to.include({
                    map: mapName,
                    duration: duration * 60,
                });

                // Dates must be compared using strict equality
                expect(testPlaylist.startTime).to.eql(testStartTime);
                expect(testPlaylist.endTime).to.eql(testEndTime);
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
