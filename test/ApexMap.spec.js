const { expect } = require('chai');
const ApexMap = require('../classes/ApexMap');

describe('@ApexMap', function() {
    it('returns an object', function() {
        expect(new ApexMap('we', 30, 20))
            .to.include({offset: 20, map: 'we', duration: 30});
    });
});
