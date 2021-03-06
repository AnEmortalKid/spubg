import { create } from "../storage/storage";

class HistoryCache {
  constructor(storage) {
    if (!HistoryCache.instance) {
      this.storage = storage ? storage : create();
      HistoryCache.instance = this;
    }

    return HistoryCache.instance;
  }

  store(playerId, history) {
    this.storage.store("history", { id: playerId, seasonData: history });
  }

  get(playerId) {
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
