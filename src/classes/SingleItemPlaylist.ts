import { parseDate } from '../util/date.js';

import BasePlaylist, { PlaylistData } from './BasePlaylist.js';
import ScheduledPlaylistItem from './ScheduledPlaylistItem.js';
import Season, { SeasonData } from './Season.js';

/**
 * Playlist for modes with a single map (e.g. [Shadow Royale]{@link https://apexlegends.fandom.com/wiki/Shadow_Royale}).
 *
 * @extends playlist
 */
class SingleItemPlaylist extends BasePlaylist {
    rotations: Array<ScheduledPlaylistItem>;

    constructor(playlistData: PlaylistData, seasonData: SeasonData | Season) {
        super(playlistData, seasonData);

        /**
         * Array containing a single {@link ScheduledPlaylistItem}. Type matches
         * other classes which extend {@link BasePlaylist} so that Array methods
         * can be used predictably.
         *
         * @type {ScheduledPlaylistItem[]}
         */
        this.rotations = [new ScheduledPlaylistItem({
            mapName: this.maps[0],
            mapDuration: (this.endTime.valueOf() - this.startTime.valueOf()),
            startTime: this.startTime
        }, this)];
    };

    /**
     * The {@link ScheduledPlaylistItem} for this playlist if within date
     * bounds, otherwise {@link null}.
     *
     * @readonly
     * @memberof SingleItemPlaylist
     * @type {?ScheduledPlaylistItem}
     */
    get currentMap() {
        if (new Date() < this.startTime) return null;
        if (new Date() > this.endTime) return null;
        return this.rotations[0];
    };

    /**
     * The {@link ScheduledPlaylistItem} for this playlist if before the
     * [start time]{@link BasePlaylist#startTime}, otherwise {@link null}.
     *
     * @readonly
     * @memberof SingleItemPlaylist
     * @type {?ScheduledPlaylistItem}
     */
    get nextMap() {
        if (new Date() < this.startTime) return this.rotations[0];
        return null;
    };

    /**
     * The {@link ScheduledPlaylistItem} for this playlist if within date
     * bounds, otherwise {@link null}.
     *
     * @param {parseableDate} [date=new Date()] the date to target
     * @returns {?ScheduledPlaylistItem} active map or {@link null}
     */
    getMapByDate(date) {
        const targetDate = parseDate(date);

        if(targetDate < this.startTime) return null;
        if(targetDate > this.endTime) return null;
        return this.rotations[0];
    };
};

export default SingleItemPlaylist;
