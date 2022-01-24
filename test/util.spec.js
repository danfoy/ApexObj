const { expect } = require('chai');

describe('util.isDate(target)', function() {
    const { isDate } = require('../util');

    it('returns true when target is an instance of Date', function() {
        expect(isDate(new Date())).to.be.true;
    });

    it('returns false when the target is not an instance of Date', function() {
        expect(isDate('foo')).to.be.false;
        expect(isDate(12)).to.be.false;
        expect(isDate('2022-01-11T12:00:00Z')).to.be.false;
    });
});

describe('util.parseDate(target)', function() {
    const { parseDate } = require('../util');

    it('throws if target is not supplied', function() {
        expect(()=>parseDate()).to.throw;
    });

    it('throws if the target is an invalid date ISO string', function() {
        expect(()=>parseDate('foo')).to.throw;
        expect(()=>parseDate('2022-13-11T12:00:00Z')).to.throw;
    });

    it('returns the target if it is already an instance of Date', function() {
        const dateExample = new Date('2021-01-21T03:00:00Z');
        const dateCopy = new Date('2021-01-21T03:00:00Z');
        expect(parseDate(dateExample)).to.deep.equal(dateCopy);
    });

    it('returns an instance of Date if target is a valid date ISO string', function() {
        expect(parseDate('2022-01-11T12:00:00Z').getMonth()).to.equal(0);
    });
});

describe('util.isParseableDate(target)', function() {
    const { isParseableDate } = require('../util');

    it('returns true when passed a date', function() {
        expect(isParseableDate(new Date())).to.be.true;
    });

    it('returns true when passed an ISO date string', function() {
        expect(isParseableDate('2022-01-11T12:00:00Z')).to.be.true;
    });

    it('returns false when passed an invalid ISO date string', function() {
        expect(isParseableDate('foo')).to.be.false;
    });
});

describe('util.randomFrom(list, quantity, options)', function() {

    const { randomFrom } = require('../util');

    it('throws when input is not an array', function() {
        expect(()=>randomFrom({sampletype: "object"})).to.throw;
    });

    describe('Single item mode', function() {
        it('returns a single item in its original type', function() {
            expect(randomFrom([1, 2, 3])).to.be.a('number');
            expect(randomFrom([true, true, true])).to.be.a('boolean');
            expect(randomFrom(['one', 'two', 'three'])).to.be.a('string');
        });
    });

    describe('Multiple item mode', function() {
        it('returns a list of items', function() {
            expect(randomFrom([1, 2, 3], 2)).to.be.an('array');
        });
        it('returns large arrays in non-subtractive mode', function() {
            expect(randomFrom([1,2], 25, {subtractive: false})).to.be.lengthOf(25);
        });
        it('only contains items from the input', function() {
            expect(randomFrom([1,2], 25, {subtractive: false})).to.include.members([1,2]);
            expect(randomFrom([1,2], 25, {subtractive: false})).to.not.include(undefined);
        });

        it("doesn't return duplicates in subtractive mode", function() {
            function checkDuplicates() {
                const results = [];
                for (let i = 0; i < 100; i++) {
                    results.push(randomFrom([1, 2, 3], 2))
                };
                return results.filter(result => result[0] == result[1]);
            };

            expect(checkDuplicates()).to.be.empty;
        });

        it('throws when subtractive and requesting > input size', function() {
            expect(()=>randomFrom(['item1', 'item2'], 2, {subtractive: true})).to.throw;
        });
    });

});
