import ComparisonCommand from "./comparisonCommand";

export default class WinRateCompareCommand extends ComparisonCommand {
  constructor() {
    super("Win Rate Comparison between players", {
      title: "Win Rate Comparison",
      attributeName: "winRate"
    });
  }
}
