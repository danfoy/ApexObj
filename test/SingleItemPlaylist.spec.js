const { expect } = require('chai');
const MockDate = require('mockdate');

const SingleItemPlaylist = require('../classes/SingleItemPlaylist');
const Season = require('../classes/Season');

const apexData = require('../data/seasons.json');
const season12Data = apexData.seasons.find(season => season.id === 12);
const season12 = new Season(season12Data);
const olympus247Data = season12Data.LTMs.find(ltm => ltm.mode === "Olympus 24/7");

const olympus247 = new SingleItemPlaylist(olympus247Data, season12);

describe('@SingleItemPlaylist', function() {
    describe('.rotations property', function() {
        it('returns an array with a single entry', function() {
            expect(olympus247.rotations.length).to.equal(1);
        });
    });

    describe('.currentMap computed property', function() {
        it('returns the map when within date bounds', function() {
            MockDate.set(olympus247.startTime + 30);
            expect(olympus247.currentMap.map).to.equal('Olympus');
            MockDate.reset();
        });

        it('returns null when outside of date bounds', function() {
            // Before start time
            MockDate.set(olympus247.startTime.getTime() - 30);
            expect(olympus247.currentMap).to.be.null;
            MockDate.reset();

            // After end time
            MockDate.set(olympus247.endTime.getTime() + 4000);
            expect(olympus247.currentMap).to.be.null;
            MockDate.reset();
        });
    });

    describe('.nextMap computed property', function() {
        it('returns the map when before playlist startTime', function() {
            MockDate.set(olympus247.startTime - 30);
            expect(olympus247.nextMap.map).to.equal('Olympus');
            MockDate.reset();
        });

        it('returns null if after playlist startTime', function() {
            MockDate.set(olympus247.startTime + 30);
            expect(olympus247.nextMap).to.be.null;
            MockDate.reset();
        });
    });

    describe('.getMapByDate(date) method', function() {
        it('throws if an invalid date is provided', function() {
            expect(()=>olympus247.getMapByDate('zzz')).to.throw();
        });

        it('uses the current date if date not provided', function() {
            MockDate.set(olympus247.startTime);
            const implicitMap = olympus247.getMapByDate();
            MockDate.reset();
            const explicitMap = olympus247.getMapByDate(olympus247.startTime);
            expect(implicitMap).to.eql(explicitMap);
        });

        it('returns null if before/after the playlist start/end', function() {
            // Before start time
            expect(olympus247.getMapByDate(olympus247.startTime.getTime() - 30))
                .to.be.null;
            expect(olympus247.getMapByDate(olympus247.endTime.getTime() + 30))
                .to.be.null;
        });
    });
});
