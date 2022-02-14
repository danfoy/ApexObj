const { isParseableDate, parseDate } = require('../util');
class Playlist {
    constructor(playlistData, seasonData) {

        this.mode = playlistData.mode;

        if (playlistData.replaces) {
            this.replaces = playlistData.replaces;
            this.takeover = true;
        };

        if (this.mode.includes("Ranked")) this.ranked = true;

        if (playlistData.LTM) this.LTM = true;

        this.startTime = isParseableDate(playlistData.startTime)
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.startTime);

        this.endTime = isParseableDate(playlistData.endTime)
            ? parseDate(playlistData.endTime)
            : parseDate(seasonData.endTime);

        this.maps = playlistData.maps;
    };

};

module.exports = Playlist;
