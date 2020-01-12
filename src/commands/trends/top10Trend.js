import SingleTrendCommand from "./singleTrendCommand";

export default class Top10TrendCommand extends SingleTrendCommand {
  constructor() {
    super(
      "Charts Top 10 Rate by season.",
      "top10Rate",
      "TopTen",
      "Top Ten Rate"
    );
  }
}
