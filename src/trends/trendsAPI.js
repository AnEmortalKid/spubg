import { get as players } from "../players/playersAPI";
import { getHistory } from "../history/historyAPI";
import { lifetimeStats } from "../api-client/pubgClient";
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
  const history = await getHistory(playerName);
  const playerId = await players().findId(playerName);
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
