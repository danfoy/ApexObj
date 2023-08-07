import { expect } from 'chai';
import legendsData from '../data/legends.json' assert { type: 'json' };
import LegendsArray from '../src/classes/LegendsArray.js';
import Legend from '../src/classes/Legend.js';

const legends = new LegendsArray(...legendsData);

describe('LegendsArray', function() {

  it('extends Array', function() {
    expect(Array.isArray(legends)).to.be.true;
  });

  describe('.randomise()', function() {
    it('returns an instance of Legend', function() {
      console.log(legends.randomise());
      expect(legends.randomise(1) instanceof Legend).to.be.true;
    });

    it('returns an array of Legend[]', function() {
      const randomLegends = legends.randomise(3);
      expect(Array.isArray(randomLegends)).to.be.true;
      expect(randomLegends).to.have.length(3);
      randomLegends.forEach(legend =>
        expect(legend instanceof Legend).to.be.true
      );
    });
  });

  describe('.random', function() {
    it('is an alias for random groupings', function() {
      expect(legends.random).to.have.property('legend');
      expect(legends.random).to.have.property('duo');
      expect(legends.random).to.have.property('trio');
    });

    describe('.legend', function() {
      it('returns a single Legend object', function() {
        expect(legends.random.legend instanceof Legend).to.be.true;
      });
    });

    describe('.duo', function() {
      it('returns an Array of Legend[]', function() {
        expect(legends.random.duo).to.be.an('array').with.length(2);
        legends.random.duo.forEach(legend => expect(legend instanceof Legend).to.be.true);
      });
    });

    describe('.trio', function() {
      it('returns an Array of Legend[]', function() {
        expect(legends.random.trio).to.be.an('array').with.length(3);
        legends.random.trio.forEach(legend => expect(legend instanceof Legend).to.be.true);
      });
    });
  });
});
