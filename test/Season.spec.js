const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-like'));
chai.use(require('chai-things'));
const MockDate = require('mockdate');
const { isDate } = require('../util');
const Season = require('../classes/Season');
const SplitPlaylist = require('../classes/SplitPlaylist');
const RotatingPlaylist = require('../classes/RotatingPlaylist');

const season11Data = require('../data/seasons.json').seasons
    .find(season => season.id == 11);
const season11 = new Season(season11Data);

const season12Data = require('../data/seasons.json').seasons
    .find(season => season.id == 12)
const season12 = new Season(season12Data);

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

    describe('.currentLTMs computed property', function() {
        it('is null if there is not a current Limited Time Mode', function() {
            // No LTMs in season11 data
            MockDate.set(season11.startTime);
            expect(season11.currentLTMs).to.be.null;
            MockDate.reset();

            // No LTM 3 weeks into season 12
            MockDate.set(season12.startTime.getTime() + (1000 * 60 * 60 * 24 * 7 * 3));
            expect(season12.currentLTMs).to.be.null;
            MockDate.reset();
        });

        it('returns the current LTM playlist(s)', function() {
            MockDate.set(season12.startTime);
            expect(season12.currentLTMs).to.have.length(2);
            MockDate.reset();
        });
    });

    describe('.currentTakeovers computed property', function() {
        it('is null if there is not a current takeover LTM', function() {
            // No LTMs in season11 data
            MockDate.set(season11.startTime);
            expect(season11.currentTakeovers).to.be.null;
            MockDate.reset();

            // No LTM 3 weeks into season 12
            MockDate.set(season12.startTime.getTime() + (1000 * 60 * 60 * 24 * 7 * 3));
            expect(season12.currentTakeovers).to.be.null;
            MockDate.reset();
        });

        it('returns the current takeover LTM playlist(s)', function() {
            MockDate.set(season12.startTime);
            expect(season12.currentTakeovers).to.have.length(1);
            MockDate.reset();
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

    describe('.nextMaps computed property', function () {
        it('returns null at end of season', function() {
            MockDate.set(season12.endTime);
            expect(season12.nextMaps).to.be.null;
            MockDate.reset()
        });

        it('returns an array without null elements if data available', function() {
            MockDate.set('2022-02-14T16:00:00Z');
            expect(season12.nextMaps).to.be.an('array');
            expect(season12.nextMaps).to.not.include(null);
            MockDate.reset();
        });

        it('filters out primary modes during takeovers', function() {
            MockDate.set('2022-02-14T16:00:00Z');
            expect(season12.nextMaps.filter(map => map.mode === "Play Apex"))
                .to.have.length(1);
            MockDate.reset();
        });
    });

    describe('.parsePlaylist(playlistData) method', function() {
        it('parses ranked playlists', function() {
            const rankedPlaylist = season12.parsePlaylist(
                season12Data.playlists.find(playlist => playlist.mode === "Ranked Leagues")
            );
            expect(rankedPlaylist instanceof SplitPlaylist).to.be.true;
            expect(rankedPlaylist instanceof RotatingPlaylist).to.be.false;
        });

        it('parses unranked playlists', function() {
            const unrankedPlaylist = season12.parsePlaylist(
                season12Data.playlists.find(playlist => playlist.mode === "Play Apex")
            );
            expect(unrankedPlaylist instanceof RotatingPlaylist).to.be.true;
            expect(unrankedPlaylist instanceof SplitPlaylist).to.be.false;
        });
    });

    describe('.getPlaylistsByDate(date) method', function() {
        it('returns null when no playlists available', function() {
            expect(season12.getPlaylistsByDate(season12.startTime - 1000)).to.be.null;
            expect(season12.getPlaylistsByDate(season12.endTime + 1000)).to.be.null;
        });

        it('uses the current date if none provided', function() {
            MockDate.set(season12.startTime);
            expect(season12.getPlaylistsByDate())
                .to.eql(season12.getPlaylistsByDate(season12.startTime));
            MockDate.reset();
        });

        it('returns correct results for season 12', function() {
            expect(season12.getPlaylistsByDate(season12.startTime)).to.have.length(4);
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

        it('returns correct values for Season 12', function() {

            // Shows the Control LTM when in date
            expect(season12.getMapsByDate('2022-02-14T01:00:00Z')
                .filter(map => map.mode === "Control")).to.have.length(1);

            // Doesn't show Control after Control finish date
            expect(season12.getMapsByDate('2022-03-03T01:00:00Z')
                .filter(map => map.mode === "Control")).to.have.length(0);

            // Includes the Olympus 24/7 event when active
            expect(season12.getMapsByDate('2022-02-14T01:00:00Z')
                .filter(map => map.mode === "Olympus 24/7")).to.have.length(1);

            // Doesn't include Play Apex mode when not active
            expect(season12.getMapsByDate('2022-02-14T01:00:00Z')
                .filter(map => map.mode === "Play Apex")).to.have.length(0);

        });
    });

});
