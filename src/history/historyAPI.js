import { get as players } from "../players/playersAPI";
import { getClient } from "../api-client/client";
import { getCache } from "./historyCache";
import { get as seasons } from "../seasons/seasonsAPI";

class History {
  constructor(
    params = {
      historyCache: getCache(),
      client: getClient(),
      players: players(),
      seasons: seasons()
    }
  ) {
    if (!History.instance) {
      this.historyCache = params.historyCache;
      this.client = params.client;
      this.players = params.players;
      this.seasons = params.seasons;

      History.instance = this;
    }
    return History.instance;
  }

  async get(playerName) {
    const playerId = await this.players.findId(playerName);

    // only search for things that will have data
    const seasonIds = await this.seasons.getSearchableIds();
    const currentHistory = this.historyCache.get(playerId);

    if (currentHistory) {
      // update with the latest season info
      const latestSeasonId = await this.seasons.getLatestSeasonId();
      if (currentHistory[latestSeasonId]) {
        console.log("Updating latest season data for " + playerName);
        currentHistory[latestSeasonId] = await this.client.playerSeason(
          playerId,
          latestSeasonId
        );
      }

      // find missing data
      for (const seasonId of seasonIds) {
        if (!(seasonId in currentHistory)) {
          console.log(`Finding data for missed season: ${seasonId}`);
          currentHistory[seasonId] = await this.client.playerSeason(
            playerId,
            seasonId
          );
        }
      }

      this.historyCache.store(playerId, currentHistory);
      return currentHistory;
    }

    console.log(`Determining historic data for ${playerName}`);
    let history = {};
    for (const seasonId of seasonIds) {
      history[seasonId] = await this.client.playerSeason(playerId, seasonId);
    }

    this.historyCache.store(playerId, history);
    return history;
  }
}

/**
 * Returns a reference to this API
 * @param {Object} dependencies param including:
 * {
 *  historyCache:
 *   client:
 *   players:
 *   season
 * }
 */
export function get(params) {
  return new History(params);
}
