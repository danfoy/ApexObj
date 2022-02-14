class PlaylistItem {
    constructor({mapName, mapDuration}, playlist) {

        // Validaton
        if (typeof mapName !== 'string' || mapName == '')
            throw new Error('mapName String required and not provided');
        if (typeof playlist.mode !== 'string' || playlist.mode == '')
            throw new Error('playlist.mode String required and not provided');

        // Required properties
        this.mode       = playlist.mode;
        this.map        = mapName;
        this.duration   = mapDuration;

        // Conditional properties
        if (playlist.ranked)    this.ranked     = true;
        if (playlist.LTM)       this.LTM        = true;
        if (playlist.takeover)  this.takeover   = true;
        if (playlist.replaces)  this.replaces   = playlist.replaces;
    };
};

module.exports = PlaylistItem;
