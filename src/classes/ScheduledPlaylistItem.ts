import PlaylistItem from './PlaylistItem.js';
import { parseDate } from '../util/date.js';
import { Playlist } from './BasePlaylist.js';

/**
 * A {@link PlaylistItem} with a designated start and end time.
 */
class ScheduledPlaylistItem extends PlaylistItem {
    startTime: Date;
    endTime: Date;

    constructor({mapName, mapDuration, startTime}, playlist: Playlist) {
        super({mapName, mapDuration}, playlist);

        this.startTime = parseDate(startTime);
        this.endTime = new Date(this.startTime.getTime() + mapDuration);
    };

    /**
     * The time until (or since the end of) this map rotation. Returns a negative
     * value if the end of this rotation has already passed when called.
     */
    get timeRemaining() {
        return this.endTime.valueOf() - new Date().valueOf();
    };
};

export default ScheduledPlaylistItem;
