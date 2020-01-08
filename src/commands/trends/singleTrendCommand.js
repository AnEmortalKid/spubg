import BaseTrendCommand from "./baseTrendCommand";
import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
import { InteractionMode } from "../interactionModes";

export default class SingleTrendCommand extends BaseTrendCommand {
  constructor(description, attributeName, filePrefix, subtitlePrefix) {
    super(description);
    this._trendOption = {
      attributeName: attributeName,
      filePrefix: filePrefix,
      subtitlePrefix: subtitlePrefix
    };
  }

  execute(commandOptions) {
    const args = commandOptions.args;
    const options = commandOptions.options;

    console.log(`${this._trendOption.attributeName} trend: ${args}`);

    switch (commandOptions.mode) {
      case InteractionMode.CLI:
        return this.cliExecute(args[0], options);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  /**
   * Generates and writes charts to the file system
   * @param {String} playerName name of player
   */
  async cliExecute(playerName, options) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);

    var gameModes = supportedGameModes;
    if (options.modes) {
      gameModes = options.modes;
    }

    this.produceTrendCharts(
      playerName,
      trendData,
      gameModes,
      this._trendOption
    );
  }
}
