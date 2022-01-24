const ApexSeason = require('./classes/ApexSeason');
const seasonData = require('./data/seasons.json').seasons[0];

console.log(new ApexSeason(seasonData));
