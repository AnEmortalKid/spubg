import { seasons } from "../api-client/pubgClient";

import SeasonsCache from "./seasonsCache";

export async function getAll() {
  const stored = SeasonsCache.getAll();

  // not empty, return it
  if (stored && stored.length) {
    return stored;
  }

  console.log("retrieving");

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
