const { isParseableDate, parseDate } = require('../util');
const Playlist = require('./Playlist');

class Season {
    constructor (seasonData) {
        this.id = seasonData.id;
        this.name = seasonData.name;
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);
        this.playlists = Array.from(seasonData.playlists, playlistData => new Playlist(playlistData, this));
    };

    get unranked() {
        return {
            battleRoyale: this.playlists
                .filter(playlist => playlist.ranked == false)
                .filter(playlist => playlist.mode == "Battle Royale")
                [0],
        };
    };

    get currentMaps() {
        return this.playlists.map(playlist => playlist.currentMap);
    };

    getMapsByDate(date) {
        return this.playlists.map(playlist => playlist.getMapByDate(date));
    };
};

module.exports = Season;
