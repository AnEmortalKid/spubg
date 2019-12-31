import { get as players } from "../players/playersAPI";
import { get as history } from "../history/historyAPI";
import { lifetimeStats } from "../api-client/pubgClient";
import { styleSeasonId } from "../styling/styler";

export const supportedGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];

/**
 * Gathers statistics for the given season
 * @param {object} seasonData data for a season, with a root key of "attributes"
 */
export function gatherStats(seasonData) {
  const gameModeIds = seasonData.attributes.gameModeStats;

  let seasonStat = {};
  Object.keys(gameModeIds).forEach(gameModeId => {
    const statEntry = gameModeIds[gameModeId];

    const roundsPlayed = statEntry.roundsPlayed;
    if (roundsPlayed == 0) {
      // no data for this gameMode
      return;
    }

    const statsForMode = {};

    const deaths = statEntry.losses;
    if (deaths != 0) {
      const kills = statEntry.kills;
      const kdCalc = kills / deaths;
      statsForMode.kd = kdCalc.toFixed(2);
    }

    // compute win rate
    const wins = statEntry.wins;
    const winRateCalc = (wins / roundsPlayed) * 100;
    statsForMode.winRate = winRateCalc.toFixed(2);

    // compute ADR
    const damage = statEntry.damageDealt;
    const adrCalc = damage / roundsPlayed;
    statsForMode.adr = adrCalc.toFixed(2);

    // most kills in a round
    statsForMode.mostKills = statEntry.roundMostKills;

    // stats for top 10
    const top10s = statEntry.top10s;
    const top10sCalc = (top10s / roundsPlayed) * 100;
    statsForMode.top10Rate = top10sCalc.toFixed(2);

    // TODO next cool stat
    seasonStat[gameModeId] = statsForMode;
  });

  return seasonStat;
}

/**
 * Gathers data across seasons returning an array in the form:
 * [
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
  ]
}
 * @param {String} playerName 
 */
export async function getSeasonHistory(playerName) {
  const playerHistory = await history().get(playerName);

  //extract each season block from history
  const seasonEntries = Object.keys(playerHistory);
  const seasonalStats = [];
  for (const seasonId of seasonEntries) {
    const seasonEntry = playerHistory[seasonId];
    const seasonStats = gatherStats(seasonEntry.data);
    seasonalStats.push({ [seasonId]: seasonStats });
  }

  return seasonalStats;
}

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
export async function getSeasonTrend(playerName) {
  const seasonalStats = await getSeasonHistory(playerName);

  const playerId = await players().findId(playerName);
  const lifetime = await lifetimeStats(playerId);

  const lifetimeInfo = gatherStats(lifetime.data);
  return { seasonal: seasonalStats, lifetime: lifetimeInfo };
}

/**
 * Gathers attribute values by season for each game mode
 * @param {String} gameModes set of game modes
 * @param {Array} seasonalEntries array of seasonal stats
 * @param {String} attributeName name of the attribute to gather
 */
export function dataByGameMode(gameModes, seasonalEntries, attributeName) {
  const stats = {};

  for (const gameMode of gameModes) {
    const gameModeStats = [];
    for (const seasonEntry of seasonalEntries) {
      const seasonId = Object.keys(seasonEntry)[0];
      const seasonData = seasonEntry[seasonId];
      const gameModeData = seasonData[gameMode];
      // cleanup name
      const seasonName = styleSeasonId(seasonId);

      // if the entry has no data, place a 0
      if (gameModeData) {
        gameModeStats.push({
          name: seasonName,
          value: parseFloat(gameModeData[attributeName])
        });
      } else {
        gameModeStats.push({ name: seasonName, value: 0.0 });
      }
    }

    // sort entries by season id
    gameModeStats.sort((a, b) => (a.name > b.name ? 1 : -1));

    stats[gameMode] = gameModeStats;
  }

  return stats;
}
