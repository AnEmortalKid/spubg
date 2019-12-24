import SingleTrendCommand from "./singleTrendCommand";

export default class KDTrendCommand extends SingleTrendCommand {
  constructor() {
    super("charts Kill/Death Rate by season", "kd", "KD", "Kill/Death Rate");
  }
}
