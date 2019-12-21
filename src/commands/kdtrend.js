import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";

export default class KDTrendCommand {
  get description() {
    return "a mapping of kd by season";
  }

  execute(args) {
    console.log(`kd trend: ${args}`);

    if (args[0]) {
      this.chartKD(args[0]);
    }
  }

  async chartKD(playerName) {
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
            value: parseFloat(gameModeData.kd)
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
        const lifetimeKD = lifetimeData[gameMode].kd;
        const chartName = playerName + "-KD-" + gameMode;
        const charTitle = playerName;
        const chartSubTitle = "KD " + gameMode;
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
