class PlaylistItem {
    constructor({mapName, mapDuration}, playlist) {
        if (typeof mapName !== 'string' || mapName == '')
            throw new Error('mapName String required and not provided');
        if (typeof mapDuration !== 'number')
            throw new Error('mapDuration Number required and not provided');
        if (typeof playlist.mode !== 'string' || playlist.mode == '')
            throw new Error('playlist.mode String required and not provided');
        if (typeof playlist.ranked !== 'boolean')
            throw new Error('playlist.ranked Boolean required and not provided');

        this.map = mapName;
        this.duration = mapDuration;
        this.mode = playlist.mode;
        this.ranked = playlist.ranked;
    };
};

module.exports = PlaylistItem;
