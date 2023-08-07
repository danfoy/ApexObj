import { parseDate } from '../util/date.js';
import Season, { SeasonData } from './Season.js';
import SplitPlaylist from './SplitPlaylist.js';
import RotatingPlaylist from './RotatingPlaylist.js';
import SingleItemPlaylist from './SingleItemPlaylist.js';

export interface PlaylistData {
    mode: string;
    maps: Array<string>;
    startTime?: string;
    endTime?: string;
    baseTime?: string;
    splitTime?: string;
    mapDurations?: Array<number>;
    LTM?: boolean;
    replaces?: string;
};

export type Playlist = SplitPlaylist | RotatingPlaylist | SingleItemPlaylist;

/**
 * Base Playlist class, used as a foundation for the more specialised playlist
 * types. You will rarely if ever see this class used explicitly - refer to the
 * specialised Playlist derivatives for each mode:
 *
 * - {@link SingleItemPlaylist}: Single-map LTMs
 * - {@link RotatingPlaylist}: Play Apex, most LTMs
 * - {@link SplitPlaylist}: Ranked Leagues
 */
export default class BasePlaylist {
    mode: string;
    LTM: boolean;
    maps: Array<string>;
    startTime: Date;
    endTime: Date;
    takeover?: boolean;
    replaces?: string;
    ranked?: boolean;
    baseTime?: Date;
    /**
     * Creates an instance of Playlist.
     * @param {PlaylistData} playlistData
     * @param {*} seasonData
     * @memberof Playlist
     */
    constructor(playlistData: PlaylistData, seasonData: SeasonData | Season) {
        this.mode = playlistData.mode;
        if (playlistData.LTM) this.LTM = true;
        if (playlistData.replaces) this.takeover = true;
        if (playlistData.replaces) this.replaces = playlistData.replaces;
        if (this.mode.includes("Ranked")) this.ranked = true;
        if (playlistData.baseTime) this.baseTime = parseDate(playlistData.baseTime);
        this.startTime = playlistData.startTime
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.startTime);
        this.endTime = playlistData.endTime
            ? parseDate(playlistData.endTime)
            : parseDate(seasonData.endTime);
        this.maps = playlistData.maps;
    };
};
