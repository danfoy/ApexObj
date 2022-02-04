const { expect } = require('chai');
const PlaylistItem = require('../classes/PlaylistItem');

function map(_mapName, _mapDuration) {
    return {mapName: _mapName, mapDuration: _mapDuration};
};

function playlist(_mode, _ranked) {
    return {mode: _mode, ranked: _ranked};
};

describe('@PlaylistItem', function() {
    it('returns an object', function() {
        expect(new PlaylistItem(map('we', 30), playlist('br', false)))
            .to.include({map: 'we', duration: 30, mode: 'br', ranked: false});
    });

    it('throws if map is not provided as a String', function() {
        expect(()=> new PlaylistItem(map('', 30))).to.throw();
        expect(()=> new PlaylistItem(10, 30)).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    })

    it('throws if duration is not provided as a Number', function() {
        expect(()=> new PlaylistItem(map('we', true), playlist('br', false))).to.throw();
        expect(()=> new PlaylistItem(map('we', '1'), playlist('br', false))).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    it('throws if playlist.mode is not provided', function() {
        expect(()=> new PlaylistItem(map('we', 30), playlist('', false))).to.throw();
        expect(()=> new PlaylistItem(map('we', 30), playlist(false, false))).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });

    it('throws if playlist.ranked is not provided', function() {
        expect(()=> new PlaylistItem(map('we', 30), playlist('br', 0))).to.throw();
        expect(()=> new PlaylistItem(map('we', 30), playlist('br', 'false'))).to.throw();
        expect(()=> new PlaylistItem(map('ol', 60), playlist('br', false))).to.not.throw();
    });
});
