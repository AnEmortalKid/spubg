import { get as players } from "../players/playersAPI";
import { playerSeason } from "../api-client/pubgClient";
import { getCache } from "./historyCache";

import { get as seasons } from "../seasons/seasonsAPI";

const HistoryCache = getCache();

export async function getHistory(playerName) {
  const playerId = await players().findId(playerName);

  // only search for things that will have data
  const seasonIds = await seasons().getSearchableIds();
  const currentHistory = HistoryCache.getHistory(playerId);

  if (currentHistory) {
    // update with the latest season info
    const latestSeasonId = await seasons().getLatestSeasonId();
    if (currentHistory[latestSeasonId]) {
      console.log("Updating latest season data for " + playerName);
      currentHistory[latestSeasonId] = await playerSeason(
        playerId,
        latestSeasonId
      );
    }

    // find missing data
    for (const seasonId of seasonIds) {
      if (!(seasonId in currentHistory)) {
        console.log(`Finding data for missed season: ${seasonId}`);
        currentHistory[seasonId] = await playerSeason(playerId, seasonId);
      }
    }

    HistoryCache.storeHistory(playerId, currentHistory);
    return currentHistory;
  }

  console.log(`Determining historic data for ${playerName}`);
  let history = {};
  for (const seasonId of seasonIds) {
    history[seasonId] = await playerSeason(playerId, seasonId);
  }

  HistoryCache.storeHistory(playerId, history);
  return history;
}
