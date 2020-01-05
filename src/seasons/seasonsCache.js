import { create } from "../storage/storage";

class SeasonsCache {
  constructor(storage) {
    if (!SeasonsCache.instance) {
      this.storage = storage ? storage : create();
      SeasonsCache.instance = this;
    }

    return SeasonsCache.instance;
  }

  /**
   * Stores the given season
   * @param {String} seasonId season identifier
   * @param {boolean} isCurrentSeason whether the season is the current season or not
   * @param {boolean} isOffSeason whether the season is an off season
   */
  store(seasonId, isCurrentSeason, isOffSeason) {
    this.storage.store("seasons", {
      id: seasonId,
      isCurrent: isCurrentSeason,
      isOffSeason: isOffSeason
    });
  }

  /**
   * Retruns all available seasons
   */
  getAll() {
    return this.storage.get("seasons");
  }

  // TODO add check for last season update to find the latest season
}

/**
 * Returns a SeasonsCache built with the given storage
 * @param {Storage} storage a storage mechanism, defaults if not provided
 */
export function getCache(storage) {
  return new SeasonsCache(storage);
}
