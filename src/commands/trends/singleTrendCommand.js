import BaseTrendCommand from "./baseTrendCommand";
import { getSeasonAndLifetimeTrend } from "../../stats/statsAPI";

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

    if (args[0]) {
      this.trendChart(args[0]);
    }
  }

  async trendChart(playerName) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);
    const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];
    this.produceTrendCharts(
      playerName,
      trendData,
      legitGameModes,
      this._trendOption
    );
  }
}
