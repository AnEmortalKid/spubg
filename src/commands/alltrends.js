import { createTrendChart } from "../chart/chartsAPI";
import { gatherTrend } from "../trends/trendsAPI";

export default class AllTrendsCommand {

    trendOptions = [
        {
            attribute: "kd",
            filePrefix: "KD",
            subtitlePrefix: "KD"
        },
        {
            attribute: "winRate",
            filePrefix: "WinRate",
            subtitlePrefix: "Win Rate"
        },
        {
            attribute: "adr",
            filePrefix: "ADR",
            subtitlePrefix: "Average Damage Rate"
        }
    ]

    get description() {
      return "gathers all trend charts for a player"
    }
  
    execute(args) {
      console.log(`all trends: ${args}`);
  
      if (args[0]) {
        this.trendChart(args[0]);
      }
    }

    produceChart(trendData, gameModes, seasonalEntries, trendOption)
    {
        const attributeName = trendOption.attribute;
        const filePrefix = trendOption.filePrefix;
        const subtitlePrefix = trendOption.subtitlePrefix;

        for (const gameMode of gameModes) {
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
              const lifetimeAttribute = lifetimeData[gameMode][attributeName];
              const chartName = playerName + "-" + filePrefix + "-" + gameMode;
              const charTitle = playerName;
              const chartSubTitle = subtitlePrefix + " " + gameMode;
              createTrendChart(
                chartName,
                charTitle,
                chartSubTitle,
                gameModeStats,
                lifetimeAttribute
              );
            }
          }
        }
    }
  
    async trendChart(playerName) {
      const trendData = await gatherTrend(playerName);
      const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];
      const seasonalEntries = trendData.seasonal;

    }
  }