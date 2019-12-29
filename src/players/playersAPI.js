import { getCache } from "./playerCache";
import { getClient } from "../api-client/client";

class Players {
  constructor(playerCache = getCache(), client = getClient()) {
    if (!Players.instance) {
      this.playerCache = playerCache;
      this.client = client;
      Players.instance = this;
    }
    return Players.instance;
  }

  async findId(playerName) {
    const stored = this.playerCache.getId(playerName);
    if (stored) {
      return stored;
    }

    const retrievedId = await client.findPlayerId(playerName);
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
