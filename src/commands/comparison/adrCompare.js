import ComparisonCommand from "./comparisonCommand";

export default class ADRCompareCommand extends ComparisonCommand {
  constructor() {
    super("ADR Comparison between players", {
      title: "Average Damage Rate Comparison",
      attributeName: "adr"
    });
  }
}
