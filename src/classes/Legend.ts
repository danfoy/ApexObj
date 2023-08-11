export interface LegendData {
  name: string;
  tagline: string;
};

export default class Legend implements LegendData {
  name: string;
  tagline: string;

  constructor(legendData: LegendData) {
    this.name = legendData.name;
    this.tagline = legendData.tagline;
  };
};
