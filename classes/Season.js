const { parseDate } = require('../util');
const RotatingPlaylist = require('./RotatingPlaylist');
const SplitPlaylist = require('./SplitPlaylist');

class Season {
    constructor (seasonData) {
        this.id = seasonData.id;
        this.name = seasonData.name;
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);
        this.playlists = [...seasonData.playlists]
            .map(playlist => this.parsePlaylist(playlist));
    };

    get unranked() {
        return {
            battleRoyale: this.playlists
                .filter(playlist => !playlist.ranked)
                .filter(playlist => playlist.mode == "Battle Royale")
                [0],
        };
    };

    get ranked() {
        return {
            battleRoyale: this.playlists
                .filter(playlist => playlist.ranked == true)
                .filter(playlist => playlist.mode == "Battle Royale")
                [0],
        };
    }

    get currentMaps() {
        return this.playlists.map(playlist => playlist.currentMap);
    };

    parsePlaylist(playlistData) {
        if (playlistData.splitTime)
            return new SplitPlaylist(playlistData, this);
        if (playlistData.mapDurations)
            return new RotatingPlaylist(playlistData, this);
    };

    getMapsByDate(date) {
        return this.playlists.map(playlist => playlist.getMapByDate(date));
    };
};

module.exports = Season;
