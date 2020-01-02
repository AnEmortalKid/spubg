import { getClient } from "../api-client/client";
import { getCache } from "./seasonsCache";

/**
 * Set of known identifiers for seasons that didn't have data in the api for the steam shard
 */
const seasonsWithoutData = [
  "division.bro.official.2017-beta",
  "division.bro.official.2017-pre1",
  "division.bro.official.2017-pre2",
  "division.bro.official.2017-pre3",
  "division.bro.official.2017-pre4",
  "division.bro.official.2017-pre5",
  "division.bro.official.2017-pre6",
  "division.bro.official.2017-pre7",
  "division.bro.official.2017-pre8",
  "division.bro.official.2017-pre9",
  "division.bro.official.2018-01",
  "division.bro.official.2018-02",
  "division.bro.official.2018-03",
  "division.bro.official.2018-04",
  "division.bro.official.2018-05",
  "division.bro.official.2018-06",
  "division.bro.official.2018-07",
  "division.bro.official.2018-08",
  "division.bro.official.2018-09"
];

/**
 * Information about Seasons
 */
class Seasons {
  constructor(seasonsCache, client) {
    if (!Seasons.instance) {
      this.seasonsCache = seasonsCache ? seasonsCache : getCache();
      this.client = client ? client : getClient();
      Seasons.instance = this;
    }
    return Seasons.instance;
  }

  /**
   * Returns the set of all seasons with their ids
   */
  async getAll() {
    const stored = this.seasonsCache.getAll();

    // not empty, return it
    if (stored && stored.length) {
      return stored;
    }

    const retrievedSeasons = await this.client.seasons();
    for (const seasonItem of retrievedSeasons) {
      const seasonId = seasonItem.id;
      const isCurrent = seasonItem.attributes.isCurrentSeason;
      const isOffSeason = seasonItem.attributes.isOffseason;

      this.seasonsCache.store(seasonId, isCurrent, isOffSeason);
    }

    return this.seasonsCache.getAll();
  }

  /**
   * Returns the set of season identifers that are searchable within the API and would have data
   */
  async getSearchableIds() {
    const allIds = await this.getAll().then(result => result.map(x => x.id));
    const searchableIds = allIds.filter(
      item => !seasonsWithoutData.includes(item)
    );
    return searchableIds;
  }

  /**
   * Finds the identifier for the latest season
   * @return the identifier for the latest season
   */
  async getLatestSeasonId() {
    const allSeasons = await this.getAll();

    for (const seasonEntry of allSeasons) {
      if (seasonEntry.isCurrent) {
        return seasonEntry.id;
      }
    }
    return null;
  }
}

/**
 * Returns a reference to this API
 * @param {SeasonsCache} cache cache for seasons
 * @param {Client} client an axios backed client to the pubg api
 */
export function get(cache, client) {
  return new Seasons(cache, client);
}
