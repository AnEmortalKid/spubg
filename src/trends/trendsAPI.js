export function gatherStats(seasonData) {
  const gameModeIds = seasonData.attributes.gameModeStats;

  let seasonStat = {};
  Object.keys(gameModeIds).forEach(gameModeId => {
    const statEntry = gameModeIds[gameModeId];

    const roundsPlayed = statEntry.roundsPlayed;
    if (roundsPlayed == 0) {
      // no data for this gameMode
      return;
    }

    const statsForMode = {};

    const deaths = statEntry.losses;
    if (deaths != 0) {
      const kills = statEntry.kills;
      const kdCalc = kills / deaths;
      statsForMode.kd = kdCalc.toFixed(2);
    }

    // compute win rate
    const wins = statEntry.wins;
    const winRateCalc = (wins / roundsPlayed) * 100;
    statsForMode.winRate = winRateCalc.toFixed(2);

    seasonStat[gameModeId] = statsForMode;
  });

  return seasonStat;
}
