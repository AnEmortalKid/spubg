import ComparisonCommand from "./comparisonCommand";

export default class KDCompareCommand extends ComparisonCommand {
  constructor() {
    super("KD Comparison between players", {
      title: "KD Comparison",
      attributeName: "kd"
    });
  }
}
