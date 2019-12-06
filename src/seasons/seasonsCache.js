// TODO memcached

import LocalStorage from "../storage/localStorage";

// TODO backing mechanism between memcache/local storage
class SeasonsCache {
  store(seasonId, isCurrentSeason, isOffSeason) {
    LocalStorage.instance()
      .get("seasons")
      .push({
        id: seasonId,
        isCurrent: isCurrentSeason,
        isOffSeason: isOffSeason
      })
      .write();
  }

  getAll() {
    return LocalStorage.instance()
      .get("seasons")
      .value();
  }
}

export default new SeasonsCache();
