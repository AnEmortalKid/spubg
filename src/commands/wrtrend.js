import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";

export default class WinRateTrendCommand {
  get description() {
    return "a mapping of kd by season";
  }

  execute(args) {
    console.log(`win rate trend: ${args}`);

    if (args[0]) {
      this.chartWinRate(args[0]);
    }
  }

  async chartWinRate(playerName) {
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
            value: parseFloat(gameModeData.winRate)
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
        const lifetimeWinRate = lifetimeData[gameMode].winRate;
        const chartName = playerName + "-Win Rate-" + gameMode;
        const charTitle = playerName;
        const chartSubTitle = "Win Rate " + gameMode;
        createTrendChart(
          chartName,
          charTitle,
          chartSubTitle,
          gameModeStats,
          lifetimeWinRate
        );
      }
    }
  }
}
