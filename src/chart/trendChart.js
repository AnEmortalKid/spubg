import BaseChart from "./baseChart";

export class TrendChart extends BaseChart {
  constructor(chartOptions) {
    super("trend");
    this.chartOptions = chartOptions;
  }

  create() {}
}
