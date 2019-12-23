import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";

export default class TrendCommand {
  constructor(description, attributeName, filePrefix, subtitlePrefix) {
    this._description = description;
    this._attributeName = attributeName;
    this._filePrefix = filePrefix;
    this._subtitlePrefix = subtitlePrefix;
  }

  get description() {
    return this._description;
  }

  execute(args) {
    console.log(`kd trend: ${args}`);

    if (args[0]) {
      this.trendChart(args[0]);
    }
  }

  async trendChart(playerName) {
    const trendData = await gatherTrend(playerName);
    const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];

    const seasonalEntries = trendData.seasonal;
    for (const gameMode of legitGameModes) {
      const gameModeStats = [];
      for (const seasonEntry of seasonalEntries) {
        const seasonId = Object.keys(seasonEntry)[0];
        const seasonData = seasonEntry[seasonId];
        const gameModeData = seasonData[gameMode];
        // cleanup name
        const seasonName = seasonId.replace("division.bro.official.pc-", "");

        // if the entry has no data, place a 0
        if (gameModeData) {
          gameModeStats.push({
            name: seasonName,
            value: parseFloat(gameModeData[this._attributeName])
          });
        } else {
          gameModeStats.push({ name: seasonName, value: 0.0 });
        }
      }

      // sort entries by season id
      gameModeStats.sort((a, b) => (a.name > b.name ? 1 : -1));

      // if someone hasn't played that mode ever don't even bother??
      const lifetimeData = trendData.lifetime;
      if (lifetimeData[gameMode]) {
        const lifetimeKD = lifetimeData[gameMode][this._attributeName];
        const chartName = playerName + "-" + this._filePrefix + "-" + gameMode;
        const charTitle = playerName;
        const chartSubTitle = this._subtitlePrefix + " " + gameMode;
        createTrendChart(
          chartName,
          charTitle,
          chartSubTitle,
          gameModeStats,
          lifetimeKD
        );
      }
    }
  }
}
