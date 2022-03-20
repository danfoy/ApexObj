const { parseDate, withinDates } = require('../util');
const Playlist = require('./Playlist');
const PlaylistItem = require('./PlaylistItem');
const ScheduledPlaylistItem = require('./ScheduledPlaylistItem');

class RotatingPlaylist extends Playlist {
    constructor(playlistData, seasonData) {
        super(playlistData, seasonData);

        // Argument validation
        if(!playlistData.maps || !playlistData.mapDurations)
            throw new Error('Requires .maps and .mapDurations from Season');

        // Private properties
        const { maps, mapDurations } = playlistData;

        // Public properties
        this.rotations = [...mapDurations.map(duration => duration * 60 * 1000)]
            .map(duration => [...maps]
                .map(map => new PlaylistItem({mapName: map, mapDuration: duration}, this))
            )
            .flat();
    };

    get rotationBaseTime() {
        return this.baseTime
            ? this.baseTime
            : this.startTime;
    };

    get playlistRotationsDuration() {
        return this.rotations
            .reduce( (accumulator, currentItem) => {
                return accumulator + currentItem.duration;
            }, 0);
    };

    get currentIndex() {
        return this.getIndexByOffset(this.getPlaylistTimeElapsed());
    };

    get currentMap() {
        return this.getMapByDate();
    };

    get nextMap() {
        if (new Date() < this.startTime) return this.getMapByDate(this.startTime);
        if (new Date() >= this.endTime) return null;
        if (this.currentMap.endTime >= this.endTime) return null;
        return this.getMapByDate(this.currentMap.endTime);
    };

    getIndexByOffset(offset) {
        const offsets = [0, ...this.rotations
            .map(playlistItem => playlistItem.duration)
            .map((duration, index, arr) => arr
                .slice(0, index + 1)
                .reduce((acc, current) => acc + current))
            .slice(0, this.rotations.length - 1)
        ];
        return this.rotations.findIndex((map, index) => offsets[index] + map.duration > offset);
    };

    getOffsetByIndex(index) {
        const targetIndex = this.normaliseIndex(index);
        if (targetIndex === 0) return 0;
        return this.rotations
            .map(rotation => rotation.duration)
            .slice(0, targetIndex)
            .reduce((acc, current) => current + acc);
    };

    normaliseIndex(target) {
        if (target < this.rotations.length) return target;
        return target % this.rotations.length;
    };

    getPlaylistTimeElapsed(date) {
        const targetDate = parseDate(date);
        const startDate = this.rotationBaseTime;
        const offset = (targetDate - startDate) % this.playlistRotationsDuration;

        if (Number.isNaN(offset)) throw new Error(`Unable to get requested offset; got '${offset}'`);

        return offset;
    };

    getMapByDate(date) {
        const targetDate = parseDate(date);
        if (!withinDates(this, date)) return null;

        const targetIndex = this.getIndexByOffset(this.getPlaylistTimeElapsed(targetDate));
        const targetRotation = this.rotations[targetIndex];
        const mapTimeElapsed = this.getPlaylistTimeElapsed(targetDate) - this.getOffsetByIndex(targetIndex);
        const targetStartTime = new Date(targetDate - mapTimeElapsed);

        return new ScheduledPlaylistItem({
            mapName: targetRotation.map,
            mapDuration: targetRotation.duration,
            startTime: targetStartTime,
        }, this);
    };
};

module.exports = RotatingPlaylist;
