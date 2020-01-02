import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
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

    switch (commandOptions.mode) {
      case "cli":
        return this.cliExecute(args);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  async cliExecute(playerName) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);
    for (const trendOption of this._trendOptions) {
      this.produceTrendCharts(
        playerName,
        trendData,
        supportedGameModes,
        trendOption
      );
    }
  }
}
