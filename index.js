const ApexSeason = require('./classes/ApexSeason');
const seasonData = require('./data/seasons.json').seasons[0];

const testApexObj = new ApexSeason(seasonData);

console.log('Season:', testApexObj);
console.log('Playlist 1:', testApexObj.playlists[0]);
