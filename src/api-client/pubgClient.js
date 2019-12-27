import { getToken } from "../config/env";

import axios from "axios";
import rateLimit from "axios-rate-limit";

require("dotenv").config();

const instance = rateLimit(
  axios.create({
    baseURL: "https://api.pubg.com/shards/steam/",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${getToken()}`
    }
  }),
  { maxRequests: 10, perMilliseconds: 60000 }
);

/**
 * Returns the list of available seasons
 */
export async function seasons() {
  return instance
    .get("/seasons")
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**
 * Fetches season information for the given player
 * @param {String} playerId
 * @param {String} seasonId
 */
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
 * Fetches lifetime information for the given player
 * @param {String} playerId the identifier for the player
 */
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

/**
 * Finds the identifier for a player with the given name
 * @param {String} playerName the name of the player
 */
export async function findPlayerId(playerName) {
  return instance
    .get(`/players?filter[playerNames]=${playerName}`)
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
    .get(`/players/${playerId}`)
    .then(function(response) {
      const innerObject = response.data;
      return innerObject;
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**
 * Returns match information for the given match
 * @param {String} matchId  identifier for the match
 */
export async function getMatch(matchId) {
  return instance
    .get(`/matches/${matchId}`)
    .then(function(response) {
      const innerObject = response.data;
      return innerObject;
    })
    .catch(function(error) {
      console.log(error);
    });
}
