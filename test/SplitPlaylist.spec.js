const { expect } = require('chai');
const MockDate = require('mockdate');
const Season = require('../classes/Season');
const SplitPlaylist = require('../classes/SplitPlaylist');
const { isParseableDate } = require('../util');

describe('@SplitPlaylist', function() {

    const apexData = require('../data/seasons.json');
    const season11RankedBRPlaylistData = apexData.seasons[0].playlists[1];
    const season11 = new Season(apexData.seasons[0]);
    const season11RankedBR = new SplitPlaylist(season11RankedBRPlaylistData, season11);

    describe('.splitTime property', function() {
        it('returns a date', function() {
            expect(isParseableDate(season11RankedBR.splitTime)).to.be.true;
        });
    });

    describe('.rotations property', function() {
        it('returns an Array', function () {
            expect(season11RankedBR.rotations).to.be.an('array');
        });

        it('returns correct results for Season 11', function() {
            console.log(season11RankedBR.rotations);
            expect(season11RankedBR.rotations[0].map).to.equal('Storm Point');
            expect(season11RankedBR.rotations[1].map).to.equal("World's Edge");
        });
    });

    describe('.currentMap computed property', function() {

        it('returns null if outside current playlist date boundary', function() {
            function check(date) {
                MockDate.set(date);
                expect(season11RankedBR.currentMap).to.be.null;
                MockDate.reset();
            };

            check('2021-11-01T00:00:00Z');
            check('2022-02-10T00:00:00Z');
        });

        it('provides correct values for Season 11', function() {
            function check(date, map) {
                MockDate.set(date);
                expect(season11RankedBR.currentMap.map).to.equal(map);
                MockDate.reset();
            };

            check('2021-11-05T00:00:00Z', 'Storm Point');
            check('2021-12-24T00:00:00Z', "World's Edge");
        });
    });

    describe('.nextMap computed property', function() {
        it('returns null if after season end', function() {
            MockDate.set('2022-02-10T00:00:00Z');
            expect(season11RankedBR.nextMap).to.be.null;
            MockDate.reset();
        });

        it('returns the first rotation if before season start', function() {
            MockDate.set('2021-11-01T00:00:00Z');
            expect(season11RankedBR.nextMap.map).to.equal('Storm Point');
            MockDate.reset();
        });

        it('returns the next split if there is one', function() {
            MockDate.set('2021-12-20T00:00:00Z');
            expect(season11RankedBR.nextMap.map).to.equal("World's Edge");
            MockDate.reset();

            // During second split
            MockDate.set('2021-12-24T00:00:00Z');
            expect(season11RankedBR.nextMap).to.be.null;
            MockDate.reset();
        });
    });

    describe('.getMapByDate(date) method', function() {

        it('throws if an invalid date is provided', function() {
            expect(()=>season11RankedBR.getMapByDate('zzz')).to.throw();
        });

        it('returns null if outside season date boundary', function() {
            function check(date) {
                expect(season11RankedBR.getMapByDate(date)).to.be.null;
            };

            check('2021-11-01T00:00:00Z');
            check('2022-02-10T00:00:00Z');
        });

        it('uses the current date if none provided', function() {
            MockDate.set('2021-11-05T00:00:00Z');
            expect(season11RankedBR.getMapByDate().map).to.equal('Storm Point');
            MockDate.reset();
        });

        it('returns correct values for Season 11', function() {
            function check(date, map) {
                console.log(season11RankedBR.getMapByDate(date));
                expect(season11RankedBR.getMapByDate(date).map)
                    .to.equal(map);
            };

            check('2021-11-05T00:00:00Z', 'Storm Point');
            check('2021-12-24T00:00:00Z', "World's Edge");
        });
    });


});
