import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";
import TrendCommand from "./trendsCommand";

export default class ADRTrendCommand extends TrendCommand {
  constructor() {
    super("a mapping of adr by season", "adr", "ADR", "Average Damage Rate");
  }
}
