import { createTrendChart } from "./chart/chartsAPI";
import { gatherTrend } from "./trends/trendsAPI";

require("dotenv").config();

async function chartKD(playerName) {
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

    console.log("stats for " + gameMode);
    console.log(gameModeStats);

    // if someone hasn't played that mode ever don't even bother??
    const lifetimeData = trendData.lifetime;
    if (lifetimeData[gameMode]) {
      const lifetimeKD = lifetimeData[gameMode].kd;
      console.log("lifetime");
      console.log(lifetimeKD);

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

chartKD("AnEmortalKid");

// FOR just playing with the chart to make it prettier
// const gameModeStats =
// [
//   { name: '2018-01', value: parseFloat('0.78') },
//   { name: '2018-02', value: parseFloat('0.98') },
//   { name: '2018-03', value: parseFloat('0.98') },
//   { name: '2018-04', value: parseFloat('0.84') },
//   { name: '2018-05', value: parseFloat('0.83') }
// ]
// const lifetime = 0.91
