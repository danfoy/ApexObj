const {isParseableDate, parseDate} = require('../util');
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

    get currentMaps() {
        if (!this.currentSeason) return null;
        return this.currentSeason.currentMaps;
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
        if (date && !isParseableDate(date))
            throw new Error(`Couldn't parse ${date} into a Date`);

        const targetDate = date ? parseDate(date) : new Date();
        return this.seasons.find(season =>
            season.startTime <= targetDate &&
            season.endTime > targetDate
        ) || null;
    };

    getMapsByDate(date) {
        if (date && !isParseableDate(date))
            throw new Error(`Couldn't parse ${date} into a Date`);

        const targetDate = date ? parseDate(date) : new Date();
        const targetSeason = this.getSeasonByDate(targetDate);
        if (!targetSeason) return null;
        return targetSeason.getMapsByDate(targetDate);
    };
};

module.exports = ApexObj;
