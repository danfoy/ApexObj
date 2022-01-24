const { expect } = require('chai');
const ApexScheduledMap = require('../classes/ApexScheduledMap');
const ApexMap = require('../classes/ApexMap');
const ApexSeason = require('../classes/ApexSeason');

describe('@ApexScheduledMap', function() {

    // const apexData = require('../data/seasons.json');
    // const season11Data = apexData[0];
    // const season11 = new ApexSeason(season11Data, '2022-01-21T01:00:00Z');
    // const worldsEdge =  new ApexMap("World's Edge", 30, 20);
    // const worldsEdgeScheduled = new ApexScheduledMap(worldsEdge, season11);

    // it('inherits properties from ApexMap provided as an argument', function() {
    //     const { map, duration } = worldsEdge;
    //     expect(new ApexScheduledMap(worldsEdge, season11)).to.include({
    //         map: map,
    //         duration: duration,
    //     });
    // });

    // describe('.playlistPosition', function() {
    //     it('gets the playlist position from the parent season', function() {
    //         const testSeason = new ApexSeason(season11Data, '2022-01-11T13:00:00Z');
    //         const testScheduledMap = new ApexScheduledMap(worldsEdge, testSeason);
    //         expect(testScheduledMap.playlistPosition).to.equal(12);
    //     });
    // });

    // describe('.offsetFromStartOfPlaylist', function() {
    //     it('calculates when this map rotation begins relative to the playlist', function() {
    //         console.log(worldsEdgeScheduled);
    //     });
    // });

});
