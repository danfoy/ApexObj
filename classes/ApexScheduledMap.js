const ApexMap = require('./ApexMap');

class ApexScheduledMap extends ApexMap {
    constructor(apexMap, apexSeason) {
        // Parse properties from parent class instance
        const {map, duration, offset } = apexMap
        super(map, duration, offset);

        // Parse properties from ApexSeason instance
        const { playlist,
            startTime: seasonStartTime,
            playlistTotalDuration,
            queryDate
        } = apexSeason;

        function getTimeSincePlaylistRotationStart(target = queryDate) {
            // times are converted to minutes
            const targetTime = (target.getTime() / 1000 / 60);
            const startTime = (seasonStartTime.getTime() / 1000 / 60);
            const offset = Math.floor(( ( targetTime - startTime ) % playlistTotalDuration ));
            if (Number.isNaN(offset)) throw new Error(`Unable to get requested offset; got '${offset}'`);
            return offset;
        };
        // Own properties
        this.timeSincePlaylistRotationStart = getTimeSincePlaylistRotationStart();
        this.playlistPosition = playlist.length;

    };

};
module.exports = ApexScheduledMap;
