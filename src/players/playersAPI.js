import { seasons, findPlayerId } from "../api-client/pubgClient";

import PlayerCache from "./playerCache";

export async function findId(playerName) {
  const stored = PlayerCache.getId(playerName);
  if (stored) {
    return stored;
  }

  console.log(`retrieving ID for ${playerName}`);

  const retrievedId = await findPlayerId(playerName);
  PlayerCache.storeId(retrievedId, playerName);
  return retrievedId;
}
