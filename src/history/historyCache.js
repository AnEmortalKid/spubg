import { create } from "../storage/storage";

class HistoryCache {
  constructor(storage = create()) {
    if (!HistoryCache.instance) {
      this.storage = storage;
      HistoryCache.instance = this;
    }

    return HistoryCache.instance;
  }

  storeHistory(playerId, history) {
    this.storage.store("history", { id: playerId, seasonData: history });
  }

  getHistory(playerId) {
    const history = this.storage.find("history", { id: playerId });
    if (history) {
      return history.seasonData;
    }
    return null;
  }
}

/**
 * Returns a HistoryCache built with the given storage
 * @param {Storage} storage a storage mechanism, defaults if not provided
 */
export function getCache(storage) {
  return new HistoryCache(storage);
}
