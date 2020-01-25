/**
 * Colors for players in a squad, slightly modified from the pubg colors
 */
export const squadPlayerColors = {
  yellow: "#bfb415",
  orange: "#D1460D",
  blue: "#2d7397",
  green: "#1a7e28",
  darkRed: "#750d20",
  pink: "#ba6c95",
  darkBlue: "#0f274c",
  teal: "#6eadb9"
};

/**
 * Stylizes the game mode into a prettier label. squad-fpp turns into Squad FPP
 * @param {String} gameMode the identifier for a game mode, ie squad-fpp
 */
export function styleGameMode(gameMode) {
  const modeParts = gameMode.split("-");

  const modeTeam = modeParts[0];
  const modeTeamPretty = modeTeam.charAt(0).toUpperCase() + modeTeam.slice(1);

  if (modeParts.length < 2) {
    return modeTeamPretty;
  }

  const modeType = modeParts[1].toUpperCase();
  return modeTeamPretty + " " + modeType;
}

const seasonNames = {
  "division.bro.official.pc-2018-01": "Survival Season 1",
  "division.bro.official.pc-2018-02": "Survival Season 2",
  "division.bro.official.pc-2018-03": "Survival Season 3",
  "division.bro.official.pc-2018-04": "Survival Season 4",
  "division.bro.official.pc-2018-05": "Survival Season 5",
  "division.bro.official.pc-2018-06": "Survival Season 6"
};

/**
 * Prettifies the season name or returns the identifier if a pretty name was not known
 * @param {String} seasonId the identifier for a season
 */
export function styleSeasonId(seasonId) {
  const name = seasonNames[seasonId];
  if (name) {
    return name;
  }
  return seasonId;
}
