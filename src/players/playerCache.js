// TODO memcached

import LocalStorage from "../storage/localStorage";

// TODO backing mechanism between memcache/local storage
class PlayerCache {
  storeId(playerId, playerName) {
    LocalStorage.instance()
      .get("players")
      .push({ id: playerId, name: playerName })
      .write();
  }

  getId(playerName) {
    const player = LocalStorage.instance()
      .get("players")
      .find({ name: playerName })
      .value();
    if (player) {
      return player.id;
    }
    return player;
  }
}

export default new PlayerCache();
