import SingleTrendCommand from "./singleTrendCommand";

export default class KDTrendCommand extends SingleTrendCommand {
  constructor() {
    super("Charts Kill/Death Rate by season.", "kd", "KD", "Kill/Death Rate");
  }
}
