const Season = require('./Season');

class ApexObj {
    constructor(apexData) {
        if (!apexData) throw new Error('No Apex Legends data provided');
        const { seasons } = apexData;

        this.seasons = seasons.map(season => new Season(season));
    };
};

module.exports = ApexObj;
