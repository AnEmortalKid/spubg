// TODO memcached

import LocalStorage from "../storage/localStorage";

// TODO backing mechanism between memcache/local storage
class HistoryCache {
  storeHistory(playerId, history) {
    console.log("Storing:");
    console.log(history);
    LocalStorage.instance()
      .get("history")
      .push({ id: playerId, seasonData: history })
      .write();
  }

  getHistory(playerId) {
    const history = LocalStorage.instance()
      .get("history")
      .find({ id: playerId })
      .value();

    if (history) {
      return history.seasonData;
    }
    return null;
  }
}

export default new HistoryCache();
