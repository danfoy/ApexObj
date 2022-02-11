const { isParseableDate, parseDate } = require('../util');
class Playlist {
    constructor(playlistData, seasonData) {

        this.mode = playlistData.mode;
        this.startTime = isParseableDate(playlistData.startTime)
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.startTime);
        this.endTime = isParseableDate(playlistData.startTime)
            ? parseDate(playlistData.startTime)
            : parseDate(seasonData.endTime);
        this.maps = playlistData.maps;

        if (playlistData.ranked) this.ranked = playlistData.ranked;
        if (playlistData.replaces) this.replaces = playlistData.replaces;

    };

};

module.exports = Playlist;
