import SingleTrendCommand from "../trends/singleTrendCommand";

export default class LongestKillCommand extends SingleTrendCommand {
  constructor() {
    super(
      "shows a plot of longest kill by season",
      "longestKill",
      "LongestKill",
      "Longest Kill"
    );
  }
}
