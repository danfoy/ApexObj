const PlaylistItem = require('./PlaylistItem');
const { isParseableDate, parseDate } = require('../util');

class ScheduledPlaylistItem extends PlaylistItem {
    constructor(mapName, mapDuration, startTime, endTime) {
        super(mapName, mapDuration);

        if (!isParseableDate(startTime)) throw new Error(`${startTime} is not a parseable date`);
        if (!isParseableDate(endTime)) throw new Error(`${endTime} is not a parseable date`);

        this.startTime = parseDate(startTime);
        this.endTime = parseDate(endTime);

    };

    get timeRemaining() {
        const timeRemaining = (this.endTime.getTime() - new Date().getTime()) / 1000 / 60;
        return timeRemaining;
    };
};

module.exports = ScheduledPlaylistItem;
