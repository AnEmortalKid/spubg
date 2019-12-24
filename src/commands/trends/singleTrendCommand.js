import BaseTrendCommand from "./baseTrendCommand";
import { gatherTrend } from "../../trends/trendsAPI";

export default class SingleTrendCommand extends BaseTrendCommand {
  constructor(description, attributeName, filePrefix, subtitlePrefix) {
    super(description);
    this._trendOption = {
      attributeName: attributeName,
      filePrefix: filePrefix,
      subtitlePrefix: subtitlePrefix
    };
  }

  execute(args) {
    console.log(`${this._trendOption.attributeName} trend: ${args}`);

    if (args[0]) {
      this.trendChart(args[0]);
    }
  }

  async trendChart(playerName) {
    const trendData = await gatherTrend(playerName);
    const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];
    this.produceTrendCharts(
      playerName,
      trendData,
      legitGameModes,
      this._trendOption
    );
  }
}
