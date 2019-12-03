// map of playerName to Id
class PlayerIdentifierCache {
  constructor() {
    this.playerMap = new Map();
  }

  storeId(playerName, id) {
    this.playerMap.set(playerName, id);
  }

  getId(playerName) {
    return this.playerMap.get(playerName);
  }

  hasPlayer(playerName) {
    return this.playerMap.has(playerName);
  }
}

export default new PlayerIdentifierCache();
