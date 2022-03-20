const { parseDate } = require('../util');
class Playlist {
    constructor(playlistData, seasonData) {

        this.mode = playlistData.mode;

        if (playlistData.replaces) {
            this.replaces = playlistData.replaces;
            this.takeover = true;
        };

        if (this.mode.includes("Ranked")) this.ranked = true;

        if (playlistData.LTM) this.LTM = true;

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

module.exports = Playlist;
