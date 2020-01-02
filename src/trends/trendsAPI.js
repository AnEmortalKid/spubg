import { get as players } from "../players/playersAPI";
import { get as history } from "../history/historyAPI";
import { getClient } from "../api-client/client";
import { gatherStats } from "../stats/statsAPI";

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
export async function gatherTrend(playerName) {
  const playerHistory = await history().get(playerName);
  const playerId = await players().findId(playerName);
  const lifetime = await getClient().lifetimeStats(playerId);

  //extract each season block from history
  const seasonEntries = Object.keys(playerHistory);
  const seasonalStats = [];
  for (const seasonId of seasonEntries) {
    const seasonEntry = playerHistory[seasonId];
    const seasonStats = gatherStats(seasonEntry);
    seasonalStats.push({ [seasonId]: seasonStats });
  }

  const lifetimeInfo = gatherStats(lifetime);
  return { seasonal: seasonalStats, lifetime: lifetimeInfo };
}
