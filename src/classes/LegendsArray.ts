import randomFrom from '../util/randomFrom.js';
import Legend, { LegendData } from './Legend.js';

/**
 * An Array of Legends with helper properties and methods.
 */
export default class LegendsArray extends Array {
  constructor(...legendsData: LegendData[]) {
    // Arrays accept an optional length argument, so we have to deal with this.
    if (typeof legendsData[0] === 'number') {
      if (legendsData[1])
        throw new Error('Only accepts LegendData or a single number');
      super(legendsData[0]);
    } else {
      const legends = legendsData.map((legendData) => new Legend(legendData));
      super();
      this.push(...legends);
    }
  }

  get random() {
    return {
      legend: this.randomise(1),
      duo: this.randomise(2),
      trio: this.randomise(3),
    };
  }

  randomise(quantity = 1) {
    return randomFrom(this, quantity);
  }
}
