const { parseDate } = require('../util');
const Season = require('./Season');

class ApexObj {
    constructor(apexData) {
        if (!apexData) throw new Error('No Apex Legends data provided');
        const { seasons } = apexData;

        this.seasons = seasons.map(season => new Season(season));
    };

    get currentSeason() {
        if (new Date() < this.seasons[0].startTime) return null;
        if (new Date() > [...this.seasons].pop().endTime) return null;
        return this.getSeasonByDate();
    };

    get nextSeason() {
        return this.getSeasonByDate(this.currentSeason.endTime);
    };

    get currentMaps() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentMaps;
    };

    get nextMaps() {
        if (!this.currentSeason) return null;
        return this.currentSeason.nextMaps;
    };

    get currentLTMs() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentLTMs;
    };

    get currentTakeovers() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentTakeovers;
    };

    getSeasonByDate(date) {
        const targetDate = parseDate(date);
        const foundSeason = this.seasons
            .find(season => (season.startTime <= targetDate) && (season.endTime > targetDate))
        return foundSeason || null;
    };

    getMapsByDate(date) {
        const targetDate = parseDate(date);
        const targetSeason = this.getSeasonByDate(targetDate);
        if (!targetSeason) return null;
        return targetSeason.getMapsByDate(targetDate);
    };
};

module.exports = ApexObj;
