import { getCache } from "./playerCache";
import { getClient } from "../api-client/client";

/**
 * Information about Players
 */
class Players {
  constructor(playerCache, client) {
    if (!Players.instance) {
      this.playerCache = playerCache ? playerCache : getCache();
      this.client = client ? client : getClient();
      Players.instance = this;
    }
    return Players.instance;
  }

  /**
   * Finds the identifier for a player with the given name
   * @param {String} playerName name of the player to search for
   */
  async findId(playerName) {
    const stored = this.playerCache.getId(playerName);
    if (stored) {
      return stored;
    }

    const retrievedId = await this.client.findPlayerId(playerName);
    this.playerCache.storeId(retrievedId, playerName);
    return retrievedId;
  }
}

/**
 * Returns a reference to this API
 * @param {PlayerCache} cache cache for players
 * @param {Client} client an axios backed client to the pubg api
 */
export function get(cache, client) {
  return new Players(cache, client);
}
