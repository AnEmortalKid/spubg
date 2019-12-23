import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";
import TrendCommand from "./trendsCommand";

export default class KDTrendCommand extends TrendCommand {
  constructor() {
    super("a mapping of K/D by season", "kd", "KD", "Kill/Death Rate");
  }
}
