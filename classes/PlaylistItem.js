class PlaylistItem {
    constructor({mapName, mapDuration}, playlist) {

        // Validaton
        if (typeof mapName !== 'string' || mapName == '')
            throw new Error('mapName String required and not provided');
        if (typeof playlist.mode !== 'string' || playlist.mode == '')
            throw new Error('playlist.mode String required and not provided');

        // Required properties
        this.map        = mapName;
        this.duration   = mapDuration;
        this.mode       = playlist.mode;

        // Conditional properties
        if (playlist.ranked)    this.ranked     = playlist.ranked;
        if (playlist.takeover)  this.takeover   = playlist.takeover;
        if (playlist.replaces)  this.replaces   = playlist.replaces;
    };
};

module.exports = PlaylistItem;
