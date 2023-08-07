import { Playlist } from "./BasePlaylist.js";

export interface PlaylistItemData {
    mapName: string;
    mapDuration: number;
};

/**
 * Represents an item in a playlist - i.e. a map rotation. Provides a duration
 * property but no start and end times - this is because they are sometimes
 * not available internally, e.g. when building a {@link RotatingPlaylist} but
 * before the start/end times have been calculated. Items for which this
 * information is available should instead be created as instances of the child
 * class {@link ScheduledPlaylistItem}.
 */
class PlaylistItem {
    mode: string;
    map: string;
    duration: number;
    ranked: boolean;
    LTM: boolean;
    takeover: boolean;
    replaces: string|null;

    constructor({mapName, mapDuration}: PlaylistItemData, playlist: Playlist) {

        // Validaton
        if (typeof mapName !== 'string' || mapName == '')
            throw new Error('mapName String required and not provided');
        if (typeof playlist.mode !== 'string' || playlist.mode == '')
            throw new Error('playlist.mode String required and not provided');

        this.mode = playlist.mode;
        this.map = mapName;
        this.duration = mapDuration;
        this.ranked = playlist?.ranked ?? false;
        this.LTM = playlist?.LTM ?? false;
        this.takeover = playlist?.takeover ?? false;
        this.replaces = playlist?.replaces ?? null;
    };
};

export default PlaylistItem;
