const { isParseableDate, parseDate } = require('../util');
class Playlist {
    constructor(playlistData, seasonData) {

        // Required properties
        this.mode = playlistData.mode;
        this.startTime = isParseableDate(playlistData.startTime)
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.startTime);
        this.endTime = isParseableDate(playlistData.endTime)
            ? parseDate(playlistData.endTime)
            : parseDate(seasonData.endTime);
        this.maps = playlistData.maps;

        // Optional/conditional properties
        if (this.mode.includes("Ranked")) this.ranked = true;
        if (playlistData.replaces) this.takeover = true;
        if (playlistData.replaces) this.replaces = playlistData.replaces;
    };

};

module.exports = Playlist;
