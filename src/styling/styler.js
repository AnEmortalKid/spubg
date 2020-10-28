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
  "division.bro.official.pc-2018-01": "S1",
  "division.bro.official.pc-2018-02": "S2",
  "division.bro.official.pc-2018-03": "S3",
  "division.bro.official.pc-2018-04": "S4",
  "division.bro.official.pc-2018-05": "S5",
  "division.bro.official.pc-2018-06": "S6",
  "division.bro.official.pc-2018-07": "S7",
  "division.bro.official.pc-2018-08": "S8",
  "division.bro.official.pc-2018-09": "S9"
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
