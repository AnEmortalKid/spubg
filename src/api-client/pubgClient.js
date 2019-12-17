import axios from "axios";
import rateLimit from "axios-rate-limit";

require("dotenv").config();

// TODO create client with token and pass that down instead
const instance = rateLimit(
  axios.create({
    baseURL: "https://api.pubg.com/shards/steam/",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${process.env.PUBG_TOKEN}`
    }
  }),
  { maxRequests: 10, perMilliseconds: 60000 }
);

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

export async function playerSeason(playerId, seasonId) {
  return instance
    .get(`/players/${playerId}/seasons/${seasonId}`)
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**
 *
 * @param {*} playerId
 * @param {*} seasonIds
 */
export async function playerSeasons(playerId, seasonIds) {
  const allSeasonData = [];

  for (const seasonId of seasonIds) {
    const seasonData = await playerSeason(playerId, seasonId);
    allSeasonData.push(seasonData);
  }

  return allSeasonData;
}

export async function lifetimeStats(playerId) {
  return instance
    .get(`/players/${playerId}/seasons/lifetime`)
    .then(function(response) {
      const innerObject = response.data;
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
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

export async function getPlayerData(playerId) {
  return instance
    .get(`/players/${playerId}`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      const innerObject = response.data;
      return innerObject;
    })
    .catch(function(error) {
      console.log(error);
    });
}

export async function getMatch(matchId) {
  return instance
    .get(`/matches/${matchId}`, {
      headers: {
        Authorization: `Bearer ${process.env.PUBG_TOKEN}`
      }
    })
    .then(function(response) {
      const innerObject = response.data;
      return innerObject;
    })
    .catch(function(error) {
      console.log(error);
    });
}
