const { expect } = require('chai');
const Season = require('../classes/Season');
const PlaylistItem = require('../classes/PlaylistItem');

const apexData = require('../data/seasons.json');

const season11Data = apexData.seasons.find(season => season.id === 11);
const season11 = new Season(season11Data);
const season11BR = season11.playlists.find(playlist => playlist.mode === "Battle Royale");
const season11Ranked = season11.playlists.find(playlist => playlist.ranked === true);

// const season12Data = apexData.seasons.find(season => season.id === 12);
// const season12 = new Season(season12Data);

function map(_mapName, _mapDuration) {
    return {mapName: _mapName, mapDuration: _mapDuration};
};

function playlist(_mode, _ranked) {
    return {mode: _mode, ranked: _ranked};
};

describe('@PlaylistItem', function() {
    it('returns an object', function() {
        expect(new PlaylistItem(map('we', 30), playlist('br', false)))
            .to.include({map: 'we', duration: 30, mode: 'br'});
    });

    it('throws if map is not provided as a String', function() {
        expect(()=> new PlaylistItem(map('', 30))).to.throw();
        expect(()=> new PlaylistItem(10, 30)).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    it('throws if playlist.mode is not provided', function() {
        expect(()=> new PlaylistItem(map('we', 30), playlist('', false))).to.throw();
        expect(()=> new PlaylistItem(map('we', 30), playlist(false, false))).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    describe('.map property', function() {
        it('returns the supplied map', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).map).to.equal('we');
        });
    });

    describe('.duration property', function() {
        it('returns the duration of the map', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).duration).to.equal(30);
        });
    });

    describe('.mode property', function() {
        it('returns the mode of the parent playlist', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).mode).to.equal('Battle Royale');
        });
    });

    describe('.ranked optional property', function() {
        it('returns true if the parent season is ranked', function() {
            expect(new PlaylistItem(map('we', 30), season11Ranked).ranked).to.be.true;
        });
        it('is undefined if the parent playlist is unranked', function() {
            expect(new PlaylistItem(map('we', 30), season11BR).ranked).to.be.undefined;
        });
    });

    // describe('.takeover optional property', function() {

    // });

    // describe('.replaces optional property', function() {

    // });
});
