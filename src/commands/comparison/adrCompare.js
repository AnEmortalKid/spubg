import ComparisonCommand from "./comparisonCommand";

export default class ADRCompareCommand extends ComparisonCommand {
  constructor() {
    super("Average Damage Rate Comparison between players.", {
      title: "Average Damage Rate Comparison",
      attributeName: "adr"
    });
  }
}
