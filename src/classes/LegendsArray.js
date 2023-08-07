import randomFrom from "../util/randomFrom.js";
import Legend from './Legend.js';

export default class LegendsArray extends Array {

  constructor(...legendsArray) {
    const legends = legendsArray.map(legendData => new Legend(legendData));
    super(...legends);
  };

  get random() {
    return {
      legend: this.randomise(1),
      duo: this.randomise(2),
      trio: this.randomise(3),
    };
  };

  randomise(quantity = 1) {
    return randomFrom(this, quantity);
  };
};
