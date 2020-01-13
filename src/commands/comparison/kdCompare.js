import ComparisonCommand from "./comparisonCommand";

export default class KDCompareCommand extends ComparisonCommand {
  constructor() {
    super("Kill/Death Rate Comparison between players.", {
      title: "KD Comparison",
      attributeName: "kd"
    });
  }
}
