// map of playerName to Id
const playerMap = new Map();

function storeId(playerName, id) {
  playerMap.set(playerName, id);
}

function getId(playerName) {
  return playerMap.get(playerName);
}

function hasPlayer(playerName) {
  return playerMap.has(playerName);
}
