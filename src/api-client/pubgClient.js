import axios from "axios";

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

export async function playerSeasons(playerId, seasonIds) {
  // todo rate limit
  // todo implement
}

export async function lifetimeStats(playerId) {
  return instance
    .get(`/players/${playerId}/seasons/lifetime`, {
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
