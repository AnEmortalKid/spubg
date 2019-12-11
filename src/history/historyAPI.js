import { findId as findPlayerId } from "../players/playersAPI";
import { playerSeason } from "../api-client/pubgClient";
import HistoryCache from "./historyCache";

export async function getHistory(playerName) {
  const playerId = await findPlayerId(playerName);

  // TODO implement from cache
  // const currentHistory = HistoryCache.getHistory(playerId);

  // // stats are tracked just need to update with the latest season info
  // if (currentHistory) {
  //   // TODO Update with latest season
  //   // todo update db
  //   return currentHistory;
  // }

  console.log(`Determining historic data for ${playerName}`);

  // TODO season data would come from the api and they would adhere to rate limited calls to not fail
  let seasonIds = [
    "division.bro.official.pc-2018-01",
    "division.bro.official.pc-2018-02",
    "division.bro.official.pc-2018-03",
    "division.bro.official.pc-2018-04",
    "division.bro.official.pc-2018-05"
  ];

  let history = {};
  for (const seasonId of seasonIds) {
    history[seasonId] = await playerSeason(playerId, seasonId);
    // TODO write it to DB
  }

  return history;
}
