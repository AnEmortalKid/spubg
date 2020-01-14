import SingleTrendCommand from "./singleTrendCommand";

export default class ADRTrendCommand extends SingleTrendCommand {
  constructor() {
    super(
      "charts Average Damage Rate by season",
      "adr",
      "ADR",
      "Average Damage Rate"
    );
  }
}
