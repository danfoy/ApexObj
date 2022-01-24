const {isParseableDate, parseDate } = require('../util');
const ApexMap = require('./ApexMap');

/**
 * Generates an array of ApexMaps
 *
 * @class RotationsList
 */
class ApexPlaylist {
    /**
     *Creates an instance of RotationsList.
     * @param {array} maps
     * @param {array} durations
     * @memberof RotationsList
     */
    constructor(playlistData, seasonData) {
        if(!playlistData.maps && !playlistData.mapDurations)
            throw new Error('Requires maps and mapDurations properties from ApexSeason');

        this.mode = playlistData.mode;
        this.ranked = playlistData.ranked;
        this.maps = playlistData.maps;
        this.mapDurations = playlistData.mapDurations;
        this.rotations = Array.from(this.mapDurations,
            duration => Array.from(this.maps,
                map => new ApexMap(map, duration))
            ).flat();
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);
        this.queryDate = isParseableDate(seasonData.queryDate) ? parseDate(seasonData.queryDate) : new Date();
    };

    get playlistRotationsDuration() {
        return this.rotations.reduce( (accumulator, currentItem) => {
            return accumulator + currentItem.duration;
        }, 0);
    };

    get currentPlaylistTimeElapsed() {
        // times are converted to minutes
        const targetTime = (this.queryDate.getTime() / 1000 / 60);
        const startTime = (this.startTime.getTime() / 1000 / 60);
        const offset = Math.floor(( ( targetTime - startTime ) % this.playlistRotationsDuration ));
        if (Number.isNaN(offset)) throw new Error(`Unable to get requested offset; got '${offset}'`);
        return offset;
    };

    get currentIndex() {
        return this.getIndexByOffset(this.currentPlaylistTimeElapsed);
    };

    get currentMap() {
        const thisRotation = this.rotations[this.currentIndex];
        const nextOffset = this.normaliseIndex(this.currentIndex + 1) !== 0
            ? this.getOffsetByIndex(this.currentIndex + 1) - this.currentPlaylistTimeElapsed
            : this.playlistRotationsDuration - this.currentPlaylistTimeElapsed;
        return {
            map: thisRotation.map,
            duration: thisRotation.duration,
            timeRemaining: nextOffset,
        };
    };

    get nextMap() {
        // Indexes need to loop if we're at the end of the playlist
        const next = this.rotations[this.normaliseIndex(this.currentIndex + 1)];
        return new ApexMap(next.map, next.duration);
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
};

module.exports = ApexPlaylist;
