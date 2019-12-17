import { findId as findPlayerId } from "../players/playersAPI";
import { playerSeason, playerSeasons } from "../api-client/pubgClient";
import HistoryCache from "./historyCache";
import {
  getLatestSeasonId,
  getAll,
  getSearchableIds
} from "../seasons/seasonsAPI";

export async function getHistory(playerName) {
  const playerId = await findPlayerId(playerName);

  // only search for things that will have data
  const seasonIds = await getSearchableIds();
  const currentHistory = HistoryCache.getHistory(playerId);

  if (currentHistory) {
    // update with the latest season info
    const latestSeasonId = await getLatestSeasonId();
    if (currentHistory[latestSeasonId]) {
      console.log("Updating latest season data");
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
