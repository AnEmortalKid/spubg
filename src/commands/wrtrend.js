import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";
import TrendCommand from "./trendsCommand";

export default class WinRateTrendCommand extends TrendCommand {
  constructor() {
    super("a mapping of Win Rate by season", "winRate", "WinRate", "Win Rate");
  }
}
