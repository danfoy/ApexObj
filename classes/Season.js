const { isParseableDate, parseDate } = require('../util');
const Playlist = require('./Playlist');

class Season {
    constructor (seasonData, queryDate) {
        this.id = seasonData.id;
        this.name = seasonData.name;
        this.queryDate = isParseableDate(queryDate) ? parseDate(queryDate) : new Date();
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
};

module.exports = Season;
