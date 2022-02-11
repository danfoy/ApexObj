const { isParseableDate, parseDate } = require('../util');
const Playlist = require('./Playlist');
const ScheduledPlaylistItem = require('./ScheduledPlaylistItem');

class SplitPlaylist extends Playlist {
    constructor(playlistData, seasonData) {
        super(playlistData, seasonData);

        if(!playlistData.splitTime || !playlistData.maps)
            throw new Error('requires maps and splitTime from playlistData');

        this.splitTime = parseDate(playlistData.splitTime);
        this.maps = playlistData.maps;
        this.rotations = [
            new ScheduledPlaylistItem({
                mapName: this.maps[0],
                mapDuration: ((this.splitTime - this.startTime)),
                startTime: this.startTime,
            }, this),
            new ScheduledPlaylistItem({
                mapName: this.maps[1],
                mapDuration: ((this.endTime - this.splitTime)),
                startTime: this.splitTime,
            }, this),
        ];
    };

    get currentMap() {
        if (new Date() < this.startTime) return null;
        if (new Date() > this.endTime) return null;
        return this.getMapByDate();
    };

    get nextMap() {
        if (new Date() > this.endTime) return null;
        if (new Date() < this.startTime) return this.rotations[0]
        if (this.getMapByDate() == this.rotations[0]) return this.rotations[1];
        return null;
    };

    getMapByDate(date) {
        if (date && !isParseableDate(date))
            throw new Error(`${date} is not a parseable date`);

        const targetDate = date ? parseDate(date) : new Date();

        if (targetDate < this.startTime) return null;
        if (targetDate > this.endTime) return null;

        return this.rotations.find(rotation =>
            rotation.startTime < targetDate &&
            rotation.endTime > targetDate
        );
    };

};

module.exports = SplitPlaylist;
