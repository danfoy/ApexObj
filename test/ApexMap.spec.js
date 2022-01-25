const { expect } = require('chai');
const ApexMap = require('../classes/ApexMap');

describe('@ApexMap', function() {
    it('returns an object', function() {
        expect(new ApexMap('we', 30))
            .to.include({map: 'we', duration: 30});
    });

    it('throws if map is not provided as a String', function() {
        expect(()=> new ApexMap('', 30, 20)).to.throw();
        expect(()=> new ApexMap(10, 30, 20)).to.throw();
    })

    it('throws if duration is not provided as a Number', function() {
        expect(()=> new ApexMap('we', true, 20)).to.throw();
        expect(()=> new ApexMap('we', '1', 20)).to.throw();
    });

    it('throws if timeRemaining is larger than duration', function(){
        expect(()=> new ApexMap('we', 20, 30)).to.throw();
    })

    describe('.timeRemaining property', function() {
        it('returns the time remaining for this map rotation', function() {
            expect(new ApexMap('we', 30, 20).timeRemaining).to.equal(20);
        });

        it('should be absent if not available', function() {
            expect(new ApexMap('we', 20)).to.not.have.property('timeRemaining');
        });
    });
});
