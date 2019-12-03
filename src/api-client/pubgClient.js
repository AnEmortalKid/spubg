import axios from "axios";
import PlayerIdentifierCache from "../players/identifierCache";

// TODO create client with token and pass that down instead
// TODO expose methods that find by player name
// TODO use cache from name -> id (or find id and then cache if not there)
const instance = axios.create({
  baseURL: "https://api.pubg.com/shards/steam/",
  headers: {
    Accept: "application/vnd.api+json"
  }
});

export async function lifetimeStatsFor(playerName) {
  const accountId = await getPlayerId(playerName);

  console.log("accountId: " + accountId);
  instance
    .get(`/players/${accountId}/seasons/lifetime`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      const innerObject = response.data;
      console.log(JSON.stringify(innerObject, null, 2));
    })
    .catch(function(error) {
      console.log(error);
    });
}

async function getPlayerId(playerName) {
  if (!PlayerIdentifierCache.hasPlayer(playerName)) {
    const playerId = await findPlayerId(playerName);
    PlayerIdentifierCache.storeId(playerName, playerId);
  }

  return PlayerIdentifierCache.getId(playerName);
}

async function findPlayerId(playerName) {
  return instance
    .get(`/players?filter[playerNames]=${playerName}`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      const innerObject = response.data;
      console.log(JSON.stringify(innerObject.data[0].id, null, 2));
      return innerObject.data[0].id;
    })
    .catch(function(error) {
      console.log(error);
    });
}
