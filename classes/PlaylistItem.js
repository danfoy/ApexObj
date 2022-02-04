class PlaylistItem {
    constructor({mapName, mapDuration}) {
        if (typeof mapName !== 'string' || mapName == '') throw new Error('mapName required and not provided');
        if (typeof mapDuration !== 'number') throw new Error('mapDuration required and not provided');

        this.map = mapName;
        this.duration = mapDuration;
    };
};

module.exports = PlaylistItem;
