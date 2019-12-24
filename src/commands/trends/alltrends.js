import { gatherTrend } from "../../trends/trendsAPI";
import BaseTrendCommand from "./baseTrendCommand";

export default class AllTrendsCommand extends BaseTrendCommand {
  constructor() {
    super("gathers all trend charts for a player");
    this._trendOptions = [
      {
        attribute: "kd",
        filePrefix: "KD",
        subtitlePrefix: "KD"
      },
      {
        attribute: "winRate",
        filePrefix: "WinRate",
        subtitlePrefix: "Win Rate"
      },
      {
        attribute: "adr",
        filePrefix: "ADR",
        subtitlePrefix: "Average Damage Rate"
      }
    ];
  }

  execute(args) {
    console.log(`all trends: ${args}`);

    if (args[0]) {
      this.trendChart(args[0]);
    }
  }

  async trendChart(playerName) {
    const trendData = await gatherTrend(playerName);
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
