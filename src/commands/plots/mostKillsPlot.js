import SingleTrendCommand from "../trends/singleTrendCommand";

export default class MostKillsCommand extends SingleTrendCommand {
  constructor() {
    super(
      "shows a plot of longest kill by season",
      "roundMostKills",
      "roundMostKills",
      "Round Most Kills"
    );
  }
}
