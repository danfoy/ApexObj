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
    constructor(season) {
        if(!season.maps && !season.mapDurations)
            throw new Error('Requires maps and mapDurations properties from ApexSeason');
        const { maps, mapDurations } = season;
        let timeAccumulator = 0;
        let rotations = [];
        mapDurations.forEach( (duration) => {
            maps.forEach( (map) => {
                const thisRotation = new ApexMap(map, duration, timeAccumulator)
                timeAccumulator += duration;
                rotations.push(thisRotation);
            });
        });
        return rotations;
    };
};

module.exports = ApexPlaylist;
