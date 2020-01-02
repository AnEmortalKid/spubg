import { getSeasonAndLifetimeTrend } from "../../stats/statsAPI";
import BaseTrendCommand from "./baseTrendCommand";

export default class AllTrendsCommand extends BaseTrendCommand {
  constructor() {
    super("gathers all trend charts for a player");
    this._trendOptions = [
      {
        attributeName: "kd",
        filePrefix: "KD",
        subtitlePrefix: "KD"
      },
      {
        attributeName: "winRate",
        filePrefix: "WinRate",
        subtitlePrefix: "Win Rate"
      },
      {
        attributeName: "adr",
        filePrefix: "ADR",
        subtitlePrefix: "Average Damage Rate"
      },
      {
        attributeName: "top10Rate",
        filePrefix: "Top10",
        subtitlePrefix: "Top Ten Rate"
      }
    ];
  }

  execute(commandOptions) {
    const args = commandOptions.args;

    console.log(`all trends: ${args}`);

    if (args[0]) {
      this.trendChart(args[0]);
    }
  }

  async trendChart(playerName) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);
    const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];

    for (const trendOption of this._trendOptions) {
      this.produceTrendCharts(
        playerName,
        trendData,
        legitGameModes,
        trendOption
      );
    }
  }
}
