import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
import BaseTrendCommand from "./baseTrendCommand";
import { InteractionMode } from "../interactionModes";

export default class AllTrendsCommand extends BaseTrendCommand {
  constructor() {
    super("Gathers all trend charts for a player.");
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
        filePrefix: "TopTen",
        subtitlePrefix: "Top Ten Rate"
      }
    ];
  }

  execute(commandOptions) {
    const args = commandOptions.args;
    const options = commandOptions.options;

    console.log(`all trends: ${args}`);

    switch (commandOptions.mode) {
      case InteractionMode.CLI:
        return this.cliExecute(args[0], options);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  async cliExecute(playerName, options) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);

    var gameModes = supportedGameModes;
    if (options.modes) {
      gameModes = options.modes;
    }

    for (const trendOption of this._trendOptions) {
      this.produceTrendCharts(playerName, trendData, gameModes, trendOption);
    }
  }
}
