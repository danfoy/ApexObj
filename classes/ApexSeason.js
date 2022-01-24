const { isParseableDate, parseDate } = require('../util');
const ApexPlaylist = require('./ApexPlaylist');

module.exports = class ApexSeason {
    constructor (seasonData, queryDate) {
        this.id = seasonData.id;
        this.maps = seasonData.maps;
        this.mapDurations = seasonData.mapDurations;
        this.queryDate = isParseableDate(queryDate) ? parseDate(queryDate) : new Date();
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);
        this.playlist = new ApexPlaylist(this);
    };

    get currentMap() {
        const currentIndex = this.currentPlaylistIndex;
        const thisRotation = this.playlist[currentIndex];
        const nextRotation = currentIndex + 1 === this.playlist.length
            ? this.playlist[0]
            : this.playlist[currentIndex + 1];
        return {
            map: thisRotation.map,
            duration: thisRotation.duration,
            timeRemaining: nextRotation.offset - this.currentPlaylistTimeElapsed
        };
    };

    get nextMap() {
        const currentMapIndex = this.currentPlaylistIndex;
        // Indexes need to loop if we're at the end of the playlist
        const nextMapIndex = currentMapIndex + 1 < this.playlist.length
            ? currentMapIndex + 1
            : 0
        const nextMap = this.playlist[nextMapIndex];
        return {
            map: nextMap.map,
            duration: nextMap.duration
        };
    };

    get playlistTotalDuration() {
        return this.playlist.reduce( (accumulator, currentItem) => {
            return accumulator + currentItem.duration;
        }, 0);
    };

    get currentPlaylistTimeElapsed() {
        // times are converted to minutes
        const targetTime = (this.queryDate.getTime() / 1000 / 60);
        const startTime = (this.startTime.getTime() / 1000 / 60);
        const offset = Math.floor(( ( targetTime - startTime ) % this.playlistTotalDuration ));
        if (Number.isNaN(offset)) throw new Error(`Unable to get requested offset; got '${offset}'`);
        return offset;
    };

    get currentPlaylistIndex() {
        const offset = this.currentPlaylistTimeElapsed;
        console.log(this.queryDate);
        console.log(this.currentPlaylistTimeElapsed);
        return this.playlist.findIndex(map => map.offset + map.duration > offset);
    };
};
