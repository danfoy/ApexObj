class PlaylistItem {
    constructor(mapName, mapDuration) {
        if (typeof mapName !== 'string' || mapName == '') throw new Error('Map name required and not provided');
        if (typeof mapDuration !== 'number') throw new Error('Map duration required and not provided');

        this.map = mapName;
        this.duration = mapDuration;
    };
};

module.exports = PlaylistItem;
