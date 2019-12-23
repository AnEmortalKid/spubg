import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";
import TrendCommand from "./trendsCommand";

export default class KDTrendCommand extends TrendCommand {
  constructor() {
    super("charts Kill/Death Rate by season", "kd", "KD", "Kill/Death Rate");
  }
}
