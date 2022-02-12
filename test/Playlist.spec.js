const { expect } = require('chai');
const Season = require('../classes/Season');
const RotatingPlaylist = require('../classes/RotatingPlaylist');
const SplitPlaylist = require('../classes/SplitPlaylist');
const SingleItemPlaylist = require('../classes/SingleItemPlaylist');

describe('@Playlist', function() {

    const apexData = require('../data/seasons.json');
    const season11PlaylistsData = apexData.seasons.find(season => season.id === 11).playlists
    const season11BRData = season11PlaylistsData.find(playlist => playlist.mode === "Play Apex");
    const season11RankedData = season11PlaylistsData.find(playlist => playlist.mode === "Ranked Leagues");
    const season11 = new Season(apexData.seasons.find(season => season.id === 11));
    const season11BR = new RotatingPlaylist(season11BRData, season11);
    const season11Ranked = new SplitPlaylist(season11RankedData, season11);
    const season12 = new Season(apexData.seasons.find(season => season.id === 12));
    const olympus247 = new SingleItemPlaylist(season12.LTMs.find(ltm => ltm.mode === 'Olympus 24/7'), season12);

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
            expect(season11BR.mode).to.equal("Play Apex");
        });
    });

    describe('.ranked conditional property', function() {
        it('returns true if the playlist is ranked, else undefined', function() {
            expect(season11BR.ranked).to.be.undefined;
            expect(season11Ranked.ranked).to.be.true;
        });
    });

    describe('.takeover conditional property', function() {
        it('returns true if the playlist is a takeover, else undefined', function() {
            expect(season11BR.takeover).to.be.undefined;
            expect(olympus247.takeover).to.be.true;
        });
    });

    describe('.replaces conditional property', function() {
        it('is undefined if the playlist is not a takeover', function() {
            expect(season11BR.replaces).to.be.undefined;
        });

        it('references an entry from the parent playlists array', function() {
            expect(season12.playlists).to.contain.something.like({mode: olympus247.replaces});
        });

    });
});
