const { isParseableDate, parseDate } = require('../util');

const Playlist = require('./Playlist');
const ScheduledPlaylistItem = require('./ScheduledPlaylistItem');

class SingleItemPlaylist extends Playlist {
    constructor(playlistData, seasonData) {
        super(playlistData, seasonData);

        this.rotations = [new ScheduledPlaylistItem({
            mapName: this.maps[0],
            mapDuration: (this.endTime - this.startTime),
            startTime: this.startTime
        }, this)];
    };

    get currentMap() {
        if (new Date() < this.startTime) return null;
        if (new Date() > this.endTime) return null;
        return this.rotations[0];
    };

    get nextMap() {
        if (new Date() < this.startTime) return this.rotations[0];
        return null;
    };

    getMapByDate(date) {
        if (date && !isParseableDate(date))
            throw new Error(`Couldn't parse ${date} into a Date`);

        const targetDate = date ? parseDate(date) : new Date();

        if(targetDate < this.startTime) return null;
        if(targetDate > this.endTime) return null;
        return this.rotations[0];
    };
};

module.exports = SingleItemPlaylist;
