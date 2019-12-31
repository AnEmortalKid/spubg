import SingleTrendCommand from "./singleTrendCommand";

export default class Top10TrendCommand extends SingleTrendCommand {
  constructor() {
    super(
      "charts Top 10 Rate by season",
      "top10Rate",
      "Top Ten",
      "Top Ten Rate"
    );
  }
}
