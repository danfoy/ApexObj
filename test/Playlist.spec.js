const { expect } = require('chai');
const Season = require('../classes/Season');
const RotatingPlaylist = require('../classes/RotatingPlaylist');

describe('@Playlist', function() {

    const apexData = require('../data/seasons.json');
    const season11PlaylistData = apexData.seasons[0].playlists[0];
    const season11 = new Season(apexData.seasons[0]);
    const season11BR = new RotatingPlaylist(season11PlaylistData, season11);

    it('throws if not provided with required ApexSeason properties', function() {
        expect(()=>new RotatingPlaylist({})).to.throw
    });

    describe('.maps property', function() {
        it("returns an Array of this season's maps", function() {
            expect(season11BR.maps).to.eql(["Storm Point", "World's Edge"]);
        });
    });

    describe('.mode property', function() {
        it('returns the mode', function() {
            expect(season11BR.mode).to.equal("Battle Royale");
        });
    });

    describe('.ranked property', function() {
        it('returns whether or not the mode is ranked', function() {
            expect(season11BR.ranked).to.be.false;
        });
    });
});
