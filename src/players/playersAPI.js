import { findPlayerId } from "../api-client/pubgClient";

import { getCache } from "./playerCache";

class Players {
  constructor(playerCache = getCache()) {
    if (!Players.instance) {
      this.playerCache = playerCache;
      Players.instance = this;
    }
    return Players.instance;
  }

  async findId(playerName) {
    const stored = this.playerCache.getId(playerName);
    if (stored) {
      return stored;
    }

    const retrievedId = await findPlayerId(playerName);
    this.playerCache.storeId(retrievedId, playerName);
    return retrievedId;
  }
}

/**
 * Returns a reference to this API
 * @param {PlayerCache} cache cache for players
 */
export function get(cache) {
  return new Players(cache);
}
