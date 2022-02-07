const { isParseableDate, parseDate } = require('../util');
class Playlist {
    constructor(playlistData, seasonData) {

        this.mode = playlistData.mode;
        this.ranked = playlistData.ranked;
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);
    };

};

module.exports = Playlist;
