import { seasons } from "../api-client/pubgClient";

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

const SeasonsCache = getCache();

/**
 * Returns the set of all seasons with their ids
 */
export async function getAll() {
  const stored = SeasonsCache.getAll();

  // not empty, return it
  if (stored && stored.length) {
    return stored;
  }

  console.log("retrieving all");

  const retrievedSeasons = await seasons();
  console.log(JSON.stringify(retrievedSeasons));

  const seasonsArray = retrievedSeasons.data;
  for (const seasonItem of seasonsArray) {
    const seasonId = seasonItem.id;
    const isCurrent = seasonItem.attributes.isCurrentSeason;
    const isOffSeason = seasonItem.attributes.isOffseason;

    SeasonsCache.store(seasonId, isCurrent, isOffSeason);
  }

  return SeasonsCache.getAll();
}

// TODO return good season names instead of ids

/**
 * Returns the set of season identifers that are searchable within the API and would have data
 */
export async function getSearchableIds() {
  const allIds = await getAll().then(result => result.map(x => x.id));
  const searchableIds = allIds.filter(
    item => !seasonsWithoutData.includes(item)
  );
  return searchableIds;
}

/**
 * Return set of season ids that are known to have data within the API
 */

/**
 * Finds the identifier for the latest season
 * @return the identifier for the latest season
 */
export async function getLatestSeasonId() {
  const allSeasons = await getAll();

  for (const seasonEntry of allSeasons) {
    if (seasonEntry.isCurrent) {
      return seasonEntry.id;
    }
  }
  return null;
}
