const { expect } = require('chai');
const MockDate = require('mockdate');
const Season = require('../classes/Season');
const Playlist = require('../classes/Playlist');

describe('@Playlist', function() {

    const apexData = require('../data/seasons.json');
    const season11PlaylistData = apexData.seasons[0].playlists[0];
    const season11 = new Season(apexData.seasons[0], '2022-01-24T02:00:00Z');
    const season11Playlist = new Playlist(season11PlaylistData, season11);

    function getPlaylist(data, date) {
        return new Playlist(data, new Season(apexData.seasons[0], date));
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
        it("returns an Array of this season's map durations", function() {
            expect(season11Playlist.mapDurations).to.eql([90, 60, 60, 120, 90, 120]);
        });
    });

    describe('.rotations property', function() {
        it('.rotations property', function() {
            expect(season11Playlist.rotations)
                .to.be.an('array');
        });
    });

    describe('.totalDuration getter', function() {
        it('returns the total playlist duration', function() {
            expect(season11Playlist.playlistRotationsDuration).to.equal(1080);
        });
    });

    describe('.currentIndex getter', function() {

        function check(date, index) {
            MockDate.set(date);
            expect(getPlaylist(season11PlaylistData).currentIndex)
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
        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, map, duration) {
                MockDate.set(date);
                expect(getPlaylist(season11PlaylistData).currentMap)
                    .to.include({map: map, duration: duration, timeRemaining: duration});
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

        it('does not return negative values', function() {
            // Regression test for known example where .timeRemaining was negative
            const testPlaylist = getPlaylist(season11PlaylistData, '2022-01-17T04:12:00Z').currentMap;
            expect(testPlaylist.timeRemaining).to.be.gt(0);
        });
    });

    describe('.nextMap getter', function() {
        it("provides correct values for Season 11 'Escape'", function() {

            function check(date, map, duration) {
                MockDate.set(date);
                expect(new Playlist(season11PlaylistData, new Season(apexData.seasons[0])).nextMap)
                    .to.include({map: map, duration: duration});
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
                return expect(season11Playlist.getIndexByOffset(offset)).to.equal(index);
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
                return expect(season11Playlist.getOffsetByIndex(index)).to.equal(offset);
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
        it('returns the time elapsed since the start of the current playlist rotation', function() {
            expect(season11Playlist.getPlaylistTimeElapsed('2022-01-24T02:00:00Z'))
                .to.equal(120);
        });
    });
});
