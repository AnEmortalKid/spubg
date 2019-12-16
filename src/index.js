import { getHistory } from "./history/historyAPI";
import {
  lifetimeStats,
  findPlayerId,
  getPlayerData,
  getMatch
} from "./api-client/pubgClient";
import PlayerCache from "./players/playerCache";
import { createTrendChart } from "./chart/chartsAPI";
import { gatherStats } from "./trends/trendsAPI";

require("dotenv").config();

/**
 * Gathers trend data across seasons and lifetime, returning an object in the form:
 {
  "seasonal": [
    {
      "division.bro.official.pc-2018-01": {
        "duo-fpp": {
          "kd": "0.78",
          "winRate": "3.81"
        },
        "solo-fpp": {
          "kd": "1.12",
          "winRate": "0.00"
        },
        "squad-fpp": {
          "kd": "0.85",
          "winRate": "2.53"
        }
      }
    }...
  ],
  "lifetime": {
    "duo-fpp": {
      "kd": "0.91",
      "winRate": "3.94"
    },
    "solo-fpp": {
      "kd": "1.07",
      "winRate": "0.00"
    },
    "squad": {
      "kd": "2.00",
      "winRate": "0.00"
    },
    "squad-fpp": {
      "kd": "0.93",
      "winRate": "4.97"
    }
  }
}
 * @param {String} playerName 
 */
async function gatherTrend(playerName) {
  const history = await getHistory(playerName);
  const playerId = PlayerCache.getId(playerName);
  const lifetime = await lifetimeStats(playerId);

  //extract each season block from history
  const seasonEntries = Object.keys(history);
  const seasonalStats = [];
  for (const seasonId of seasonEntries) {
    const seasonEntry = history[seasonId];
    const seasonStats = gatherStats(seasonEntry.data);
    seasonalStats.push({ [seasonId]: seasonStats });
  }

  const lifetimeInfo = gatherStats(lifetime.data);

  return { seasonal: seasonalStats, lifetime: lifetimeInfo };
}

gatherTrend("AnEmortalKid").then(result =>
  console.log(JSON.stringify(result, null, 2))
);

// findPlayerId("AnEmortalKid").then(result => console.log(result));

// getPlayerData("account.b1f527bb2223426a8deecb2a8f3a3f11").then(result => {
//   console.log(JSON.stringify(result, null, 2))

//   const matches = result.data.relationships.matches.data;
//   console.log('Matches:' + matches.length);
// });

// getHistory("AnEmortalKid").then(result =>
// console.log(JSON.stringify(result, null, 2)));

// getMatch("8c5e9b5f-a688-4c15-97b8-39bd7d54a1e4").then(result =>
//   console.log(JSON.stringify(result, null, 2)));
