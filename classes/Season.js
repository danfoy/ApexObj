const { parseDate, withinDates } = require('../util');
const RotatingPlaylist = require('./RotatingPlaylist');
const SplitPlaylist = require('./SplitPlaylist');
const SingleItemPlaylist = require('./SingleItemPlaylist');

class Season {
    constructor (seasonData) {
        this.id = seasonData.id;
        this.name = seasonData.name;
        this.startTime = parseDate(seasonData.startTime);
        this.endTime = parseDate(seasonData.endTime);

        const availablePlaylists = [...seasonData.playlists]
            .map(playlist => this.parsePlaylist(playlist));
        const availableLTMs = seasonData.LTMs
            ? [...seasonData.LTMs]
                .map(ltm => this.parsePlaylist({...ltm, LTM: true}))
            : []

        this.playlists = [
            ...availablePlaylists,
            ...availableLTMs,
        ];
    };

    get unranked() {
        return {
            battleRoyale: this.playlists
                .find(playlist => playlist.mode == 'Play Apex')
        };
    };

    get ranked() {
        return {
            battleRoyale: this.playlists
                .find(playlist => playlist.mode == 'Ranked Leagues')
        };
    };

    get currentPlaylists() {
        return this.getPlaylistsByDate();
    };

    get currentMaps() {
        return this.getMapsByDate();
    };

    get nextMaps() {
        let nextMaps = this.playlists
            .map(playlist => playlist.nextMap)
            .filter(map => map !== null);

        if (this.currentTakeovers) this.currentTakeovers.forEach(takeover => {
            nextMaps = nextMaps.filter(map => map.mode !== takeover.replaces);
            nextMaps.push(this.playlists
                .find(playlist => playlist.mode === takeover.replaces)
                .getMapByDate(takeover.endTime)
            );
        });

        if (!nextMaps.length) return null;
        return nextMaps;
    };

    get LTMs() {
        const availableLTMs = this.playlists.filter(playlist => playlist.LTM);
        if (!availableLTMs.length) return null;
        return availableLTMs;
    };

    get currentLTMs() {
        if (!this.LTMs) return null;
        const currentLTMs = this.LTMs
            .filter(ltm => withinDates(ltm));
        if (currentLTMs.length === 0) return null;
        return currentLTMs;
    };

    get takeovers() {
        if (!this.LTMs) return null;
        const takeovers = this.LTMs.filter(ltm => ltm.takeover);
        if (!takeovers.length) return null;
        return takeovers;
    };

    get currentTakeovers() {
        if (!this.takeovers) return null;
        const now = new Date();
        const currentTakeovers = this.takeovers
            .filter(takeover => withinDates(takeover));
        if (!currentTakeovers.length) return null;
        return currentTakeovers;
    };

    parsePlaylist(playlistData) {
        if (playlistData.splitTime)
            return new SplitPlaylist(playlistData, this);
        if (playlistData.mapDurations)
            return new RotatingPlaylist(playlistData, this);
        if (playlistData.maps.length === 1)
            return new SingleItemPlaylist(playlistData, this);
    };

    getPlaylistsByDate(date) {
        const targetDate = parseDate(date);
        let availablePlaylists = this.playlists
            .filter(playlist => withinDates(playlist, targetDate));

        const takeovers = availablePlaylists
            .filter(playlist => playlist.takeover);

        takeovers.forEach(takeover => availablePlaylists = availablePlaylists
            .filter(playlist => playlist.mode !== takeover.replaces));

        if (availablePlaylists.length === 0) return null;
        return availablePlaylists;
    };

    getMapsByDate(date) {
        if (!withinDates(this, date)) return null;
        const targetDate = parseDate(date);
        return this.getPlaylistsByDate(targetDate)
            .map(playlist => playlist.getMapByDate(targetDate));
    };
};

module.exports = Season;
