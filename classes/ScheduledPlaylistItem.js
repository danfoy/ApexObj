const PlaylistItem = require('./PlaylistItem');
const { parseDate } = require('../util');

class ScheduledPlaylistItem extends PlaylistItem {
    constructor({mapName, mapDuration, startTime}, season) {
        super({mapName, mapDuration}, season);

        this.startTime = parseDate(startTime);
        this.endTime = new Date(this.startTime.getTime() + mapDuration);
    };

    get timeRemaining() {
        return this.endTime - new Date();
    };
};

module.exports = ScheduledPlaylistItem;
