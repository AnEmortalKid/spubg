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

export function lifetimeStatsFor(playerName) {
  const accountId = getPlayerId(playerName);

  instance
    .get(`/players/${accountId}/seasons/lifetime`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getPlayerId(playerName) {
  if (!PlayerIdentifierCache.hasPlayer(playerName)) {
    const playerId = findPlayerId(playerName);
    PlayerIdentifierCache.storeId(playerName, playerId);
  }

  return PlayerIdentifierCache.getId(playerName);
}

function findPlayerId(playerName) {
  instance
    .get(`/players?filter[playerNames]=${playerName}`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      console.log(response.data.id);
      return response.data.id;
    })
    .catch(function(error) {
      console.log(error);
    });
}
