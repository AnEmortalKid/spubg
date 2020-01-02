import BaseTrendCommand from "./baseTrendCommand";
import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";

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
    console.log(`${this._trendOption.attributeName} trend: ${args}`);

    switch (commandOptions.mode) {
      case "cli":
        return this.cliExecute(args);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  /**
   * Generates and writes charts to the file system
   * @param {String} playerName name of player
   */
  async cliExecute(playerName) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);
    // TODO support filtering mode
    this.produceTrendCharts(
      playerName,
      trendData,
      supportedGameModes,
      this._trendOption
    );
  }
}
