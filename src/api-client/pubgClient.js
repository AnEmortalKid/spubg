import axios from "axios";
import PlayerIdentifierCache from "../players/identifierCache";

// TODO create client with token and pass that down instead
const instance = axios.create({
  baseURL: "https://api.pubg.com/shards/steam/",
  headers: {
    Accept: "application/vnd.api+json"
  }
});

/**
 * Returns the list of available seasons
 */
export async function seasons() {
  return instance
    .get("/seasons", {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

// for testing
export async function playerSeason(playerId, seasonId) {
  return instance
    .get(`/players/${playerId}/seasons/${seasonId}`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**
 * Returns season info for the player and the season
 */
export async function seasonFor(playerName, season) {
  return null;
}

export async function lifetimeStatsFor(playerName) {
  const accountId = await getPlayerId(playerName);

  return instance
    .get(`/players/${accountId}/seasons/lifetime`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      const innerObject = response.data;
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

export async function getPlayerId(playerName) {
  if (!PlayerIdentifierCache.hasPlayer(playerName)) {
    const playerId = await findPlayerId(playerName);
    PlayerIdentifierCache.storeId(playerName, playerId);
  }

  return PlayerIdentifierCache.getId(playerName);
}

export async function findPlayerId(playerName) {
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
