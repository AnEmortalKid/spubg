// TODO memcached

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

// TODO backing mechanism between memcache/local storage
// TODO object specific cache?
class PlayerCache {
  constructor() {
    const adapter = new FileSync("db.json");
    this.db = low(adapter);
    this.db.defaults({ players: [] }).write();
  }

  // todo standardize api or some shiz
  storeId(playerId, playerName) {
    this.db
      .get("players")
      .push({ id: playerId, name: playerName })
      .write();
  }

  getId(playerName) {
    const player = this.db
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
