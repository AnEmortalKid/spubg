import { getToken } from "../config/env";

import axios from "axios";
import rateLimit from "axios-rate-limit";

class Client {
  constructor(axiosClient = createDefault()) {
    if (!Client.instance) {
      this.axiosClient = axiosClient;
      Client.instance = this;
    }
    return Client.instance;
  }

  /**
   * Finds the identifier for a player with the given name
   * @param {String} playerName the name of the player
   */
  async findPlayerId(playerName) {
    return this.axiosClient
      .get(`/players?filter[playerNames]=${playerName}`)
      .then(function(response) {
        const innerObject = response.data;
        return innerObject.data[0].id;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  /**
   * Returns the list of available seasons
   */
  async seasons() {
    return this.axiosClient
      .get("/seasons")
      .then(function(response) {
        const innerObject = response.data;
        // https://documentation.pubg.com/en/seasons-endpoint.html#/Seasons/get_seasons
        // data: holds the array
        return innerObject.data;
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
  async playerSeason(playerId, seasonId) {
    return this.axiosClient
      .get(`/players/${playerId}/seasons/${seasonId}`)
      .then(function(response) {
        const innerObject = response.data;
        // https://documentation.pubg.com/en/seasons-endpoint.html#/Season_Stats/get_players__accountId__seasons__seasonId_
        // data holds the object
        return innerObject.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  /**
 * Fetches lifetime information for the given player
 * @param {String} playerId the identifier for the player
 */
  async lifetimeStats(playerId) {
  return this.axiosClient
    .get(`/players/${playerId}/seasons/lifetime`)
    .then(function(response) {
      const innerObject = response.data;
      // https://documentation.pubg.com/en/lifetime-stats.html#/Lifetime_Stats/get_players__accountId__seasons_lifetime
      // data holds the response object
      return innerObject.data;
    })
    .catch(function(error) {
      console.log(error);
    });
}
}

/**
 * Creates the default axios instance
 */
function createDefault() {
  return rateLimit(
    axios.create({
      baseURL: "https://api.pubg.com/shards/steam/",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${getToken()}`
      }
    }),
    { maxRequests: 10, perMilliseconds: 60000 }
  );
}

/**
 * Gets a reference to the PUBG client
 * @param {Object} axiosClient an axios instance to initialize the client with
 */
export function getClient(axiosClient) {
  return new Client(axiosClient);
}
