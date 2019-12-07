import { getHistory } from "./history/historyAPI";
import { lifetimeStats } from "./api-client/pubgClient";
import PlayerCache from "./players/playerCache";

require("dotenv").config();

//seasons().then(data => console.log(JSON.stringify(data, null, 2)));

// You can swap your account id here 2
let accountId = "account.b1f527bb2223426a8deecb2a8f3a3f11";

// TODO seasons would come from a cache to avoid that hit to store all of em
let seasons = [
  "division.bro.official.pc-2018-01",
  "division.bro.official.pc-2018-02",
  "division.bro.official.pc-2018-03",
  "division.bro.official.pc-2018-04",
  "division.bro.official.pc-2018-05"
];

// TODO gather other datapoints
// async function gatherKdPlot(playerId) {
//   // mode -> season -> kd
//   let kdPlot = {};

//   for (const season of seasons) {
//     const result = await playerSeason(playerId, season);
//     const stats = result.data.attributes.gameModeStats;

//     let seasonStat = {};
//     Object.keys(stats).forEach(statsId => {
//       const statEntry = stats[statsId];

//       const deaths = statEntry.losses;
//       if (deaths != 0) {
//         const kills = statEntry.kills;
//         const kdCalc = kills / deaths;
//         seasonStat[statsId] = kdCalc.toFixed(2);
//       }
//     });
//     kdPlot[season] = seasonStat;
//   }

//   return kdPlot;
// }

// async function kdFor(playerName) {
//   console.log(`Plot for ${playerName}\n`);
//   let playerId = await getPlayerId(playerName);
//   gatherKdPlot(playerId).then(result => console.log(result));
// }

// // kdFor("AnEmortalKid");

// async function findFromCache(playerName) {
//   const knownId = PlayerCache.getId(playerName);
//   if (!knownId) {
//     console.log(`Unknown id for ${playerName}`);
//     let playerId = await getPlayerId(playerName);
//     console.log(`Storing: ${playerId}`);
//     PlayerCache.storeId(playerId, playerName);
//   }

//   console.log(`PlayerId: ${PlayerCache.getId(playerName)}`);
// }

//allSeasons().then(result => console.log(JSON.stringify(result, null, 2)));
// gatherKdPlot(playerId).then(result => console.log(result));

function gatherStats(seasonStatResult) {
  const gameModeIds = seasonStatResult.data.attributes.gameModeStats;

  let seasonStatistics = {};
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

    seasonStatistics[gameModeId] = statsForMode;
  });

  return seasonStatistics;
}

function computeDataPoints(allStats) {
  const plotPointsByGameMode = {};
  const seasonEntries = Object.keys(allStats);
  console.log(seasonEntries);

  for (const seasonId of seasonEntries) {
    const seasonData = allStats[seasonId];
    const gameModes = Object.keys(seasonData);
    console.log("seasonId: " + seasonId);
    console.log(gameModes);

    for (const gameMode of gameModes) {
      if (!plotPointsByGameMode[gameMode]) {
        plotPointsByGameMode[gameMode] = [];
      }

      const gameModeData = seasonData[gameMode];
      console.log("gameMode: " + gameMode);
      console.log(JSON.stringify(gameModeData));

      const dataPoint = {};
      dataPoint[seasonId] = gameModeData;
      plotPointsByGameMode[gameMode].push(dataPoint);
    }
  }

  return plotPointsByGameMode;
}

async function gatherTrend(playerName) {
  const history = await getHistory(playerName);
  const playerId = PlayerCache.getId(playerName);
  const lifetime = await lifetimeStats(playerId);
  const lifetimeEntry = { lifetime: gatherStats(lifetime) };

  const combinedData = { ...history, ...lifetimeEntry };
  console.log("COMBINED DATA\n");
  console.log(JSON.stringify(combinedData, null, 2));

  const plotPointsByGameMode = computeDataPoints(combinedData);
  console.log("PLOT DATA\n");
  console.log(JSON.stringify(plotPointsByGameMode, null, 2));

  // map of mode -> data point (seasonId -> object)

  // TODO rethink plot data

  // // produce:
  // // [ '', 'mode']
  // // [ 'seasonId', 'kd val']

  // var table = [
  //   ['KD Trend', 'squad-fpp'],
  // ]

  // // TODO these seasons would come from the set of seasons

  // for(const seasonEntry of gameModeEntry)
  // {
  //   const seasonId = Object.keys(seasonEntry);
  //   const kdForSeason = seasonEntry[seasonId].kd;
  //   table.push([seasonId, kdForSeason]);
  // }

  // console.log(table.join('\n'));
}

// getHistory("AnEmortalKid").then(result => console.log(JSON.stringify(result, null, 2)));

gatherTrend("AnEmortalKid");
