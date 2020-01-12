import SingleTrendCommand from "./singleTrendCommand";

export default class WinRateTrendCommand extends SingleTrendCommand {
  constructor() {
    super("Charts Win Rate by season.", "winRate", "WinRate", "Win Rate");
  }
}
