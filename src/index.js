import { playerSeason, getPlayerId } from "./api-client/pubgClient";

import PlayerCache from "./cache/playerCache";

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
async function gatherKdPlot(playerId) {
  // mode -> season -> kd
  let kdPlot = {};

  for (const season of seasons) {
    const result = await playerSeason(playerId, season);
    const stats = result.data.attributes.gameModeStats;

    let seasonStat = {};
    Object.keys(stats).forEach(statsId => {
      const statEntry = stats[statsId];

      const deaths = statEntry.losses;
      if (deaths != 0) {
        const kills = statEntry.kills;
        const kdCalc = kills / deaths;
        seasonStat[statsId] = kdCalc.toFixed(2);
      }
    });
    kdPlot[season] = seasonStat;
  }

  return kdPlot;
}

async function kdFor(playerName) {
  console.log(`Plot for ${playerName}\n`);
  let playerId = await getPlayerId(playerName);
  gatherKdPlot(playerId).then(result => console.log(result));
}

// kdFor("AnEmortalKid");

async function findFromCache(playerName) {
  const knownId = PlayerCache.getId(playerName);
  if (!knownId) {
    console.log(`Unknown id for ${playerName}`);
    let playerId = await getPlayerId(playerName);
    console.log(`Storing: ${playerId}`);
    PlayerCache.storeId(playerId, playerName);
  }

  console.log(`PlayerId: ${PlayerCache.getId(playerName)}`);
}

findFromCache("AnEmortalKid");

// gatherKdPlot(playerId).then(result => console.log(result));
