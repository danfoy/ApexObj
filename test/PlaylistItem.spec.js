const { expect } = require('chai');
const PlaylistItem = require('../classes/PlaylistItem');

describe('@PlaylistItem', function() {
    it('returns an object', function() {
        expect(new PlaylistItem({mapName:'we', mapDuration: 30}))
            .to.include({map: 'we', duration: 30});
    });

    it('throws if map is not provided as a String', function() {
        expect(()=> new PlaylistItem('', 30, 20)).to.throw();
        expect(()=> new PlaylistItem(10, 30, 20)).to.throw();
    })

    it('throws if duration is not provided as a Number', function() {
        expect(()=> new PlaylistItem('we', true, 20)).to.throw();
        expect(()=> new PlaylistItem('we', '1', 20)).to.throw();
    });
});
