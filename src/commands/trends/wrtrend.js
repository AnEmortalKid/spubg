import TrendCommand from "./trendsCommand";

export default class WinRateTrendCommand extends SingleTrendCommand {
  constructor() {
    super("charts Win Rate by season", "winRate", "WinRate", "Win Rate");
  }
}
