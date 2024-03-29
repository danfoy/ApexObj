/*

This set of tests uses unit tests. This is fine, but I've moved to using tests
only on the API surface for the rest of the classes so I don't have to fiddle
with implementation tests for things which don't affect output. At some point
I should rewrite these.

*/

// TODO: rewrite unit tests as integration tests

import { expect } from 'chai';
import { set, reset } from 'mockdate';
import RotatingPlaylist from '../dist/classes/RotatingPlaylist.js';
import PlaylistItem from '../dist/classes/PlaylistItem.js';
import ScheduledPlaylistItem from '../dist/classes/ScheduledPlaylistItem.js';
import seasons from '../dist/data/seasons.json' assert { type: 'json' };

const seasonData = seasons[0];
const mockSeasonObj = {mode: 'br', ranked: false};


describe('ScheduledPlaylistItem', function() {
    it('returns a superset of PlaylistItem', function() {
        const testStartTime = new Date();
        const testPlaylistItem = new PlaylistItem({mapName: 'we', mapDuration: 60, startTime: testStartTime}, mockSeasonObj);
        expect(new ScheduledPlaylistItem({mapName: 'we', mapDuration: 60, startTime: new Date()}, mockSeasonObj))
            .to.include(testPlaylistItem);
    });

    it('throws if startTime is invalid', function() {
        expect(()=> new ScheduledPlaylistItem({mapName: 'we', mapDuration: 60, startTime: 'zzz'}, mockSeasonObj))
            .to.throw();

        expect(()=> new ScheduledPlaylistItem({mapName: 'we', mapDuration: 60, startTime: new Date()}, mockSeasonObj))
            .to.not.throw();
    });


    describe('.timeRemaining readonly property', function() {
        it('returns known correct values from season 11', function() {

            function check(date, mapDuration) {

                // Time remaining at start of rotation
                set(date);
                const timeRemaining = new RotatingPlaylist(seasonData.playlists[0], seasonData).currentMap.timeRemaining;
                expect(timeRemaining).to.equal(mapDuration * 1000 * 60)
                reset();

                // Time remaining half an hour into rotation
                const halfHourOffset = new Date(new Date(date).getTime() + (30 * 60 * 1000));
                set(halfHourOffset);
                const offsetTimeRemaining = new RotatingPlaylist(seasonData.playlists[0], seasonData).currentMap.timeRemaining;
                expect(offsetTimeRemaining).to.equal( (mapDuration * 1000 * 60) - (30 * 60 * 1000));
                reset();
            };

            check('2022-01-11T12:00:00Z', 60  )
            check('2022-01-11T13:00:00Z', 120 )
            check('2022-01-11T15:00:00Z', 120 )
            check('2022-01-11T17:00:00Z', 90  )
            check('2022-01-11T18:30:00Z', 90  )
            check('2022-01-11T20:00:00Z', 120 )
            check('2022-01-11T22:00:00Z', 120 )
            check('2022-01-12T00:00:00Z', 90  )
            check('2022-01-12T01:30:00Z', 90  )
            check('2022-01-12T03:00:00Z', 60  )
            check('2022-01-12T04:00:00Z', 60  )
        });

        it('does not return negative values', function() {
            // Regression test for known example where .timeRemaining was negative
            function check(date) {
                set(date);
                expect(new RotatingPlaylist(seasonData.playlists[0], seasonData).currentMap.timeRemaining)
                    .to.be.gt(0);
                reset();
            };

            check('2022-01-17T04:10:00Z');
        });
    });

});
