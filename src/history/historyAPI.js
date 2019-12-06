import { findId as findPlayerId } from "../players/playersAPI";
import { playerSeason } from "../api-client/pubgClient";
import HistoryCache from "./historyCache";

// season from the api
async function gatherSeasonStats(playerId, seasonId) {
  const result = await playerSeason(playerId, seasonId);
  console.log(`Result: ${JSON.stringify(result, null, 2)}`);
  const gameModeIds = result.data.attributes.gameModeStats;

  let seasonStat = {};
  Object.keys(gameModeIds).forEach(gameModeId => {
    console.log("Processing: " + gameModeId);
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

    seasonStat[gameModeId] = statsForMode;
  });

  return seasonStat;
}

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
    history[seasonId] = await gatherSeasonStats(playerId, seasonId);
    // TODO write it to DB
  }

  return history;
}
