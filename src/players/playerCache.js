import { create } from "../storage/storage";

class PlayerCache {
  constructor(storage = create()) {
    this.storage = storage;
  }

  storeId(playerId, playerName) {
    this.storage.store("players", {
      id: playerId,
      name: playerName
    });
  }

  getId(playerName) {
    const player = this.storage.find("players", {
      name: playerName
    });
    if (player) {
      return player.id;
    }
    return player;
  }
}

/**
 * Returns a PlayerCache built with the given storage
 * @param {Storage} storage a storage mechanism, defaults if not provided
 */
export function getCache(storage) {
  return new PlayerCache(storage);
}
