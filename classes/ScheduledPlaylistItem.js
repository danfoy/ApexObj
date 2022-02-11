const PlaylistItem = require('./PlaylistItem');
const { isParseableDate, parseDate } = require('../util');

class ScheduledPlaylistItem extends PlaylistItem {
    constructor({mapName, mapDuration, startTime}, season) {
        super({mapName, mapDuration}, season);

        if (!isParseableDate(startTime)) throw new Error(`${startTime} is not a parseable date`);

        this.startTime = parseDate(startTime);
        this.endTime = new Date(this.startTime.getTime() + (mapDuration - 1));
    };

    get timeRemaining() {
        return this.endTime - new Date();
    };
};

module.exports = ScheduledPlaylistItem;
