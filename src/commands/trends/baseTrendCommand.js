import { createTrendChart } from "../../chart/chartsAPI";
import { styleSeasonId, styleGameMode } from "../../styling/styler";

/**
 * Basic template for a class that can generate trend data
 */
export default class BaseTrendCommand {
  constructor(description) {
    this._description = description;
  }

  get description() {
    return this._description;
  }

  /**
   * Computes and produces charts with the trendOption for each game mode
   * @param {String} playerName name of the player
   * @param {Array} trendData data points in the form [seasonalEntries: [], lifetime: [] ]
   * @param {Array} gameModes Set of game modes to filter trend data
   * @param {Object} trendOption object with attributes { attributeName, filePrefix, subtitlePrefix}
   */
  produceTrendCharts(playerName, trendData, gameModes, trendOption) {
    const seasonalEntries = trendData.seasonal;

    const attributeName = trendOption.attributeName;
    const filePrefix = trendOption.filePrefix;
    const subtitlePrefix = trendOption.subtitlePrefix;

    for (const gameMode of gameModes) {
      const gameModeStats = [];
      for (const seasonEntry of seasonalEntries) {
        const seasonId = Object.keys(seasonEntry)[0];
        const seasonData = seasonEntry[seasonId];
        const gameModeData = seasonData[gameMode];
        // cleanup name
        const seasonName = styleSeasonId(seasonId);

        // if the entry has no data, place a 0
        if (gameModeData) {
          gameModeStats.push({
            name: seasonName,
            value: parseFloat(gameModeData[attributeName])
          });
        } else {
          gameModeStats.push({ name: seasonName, value: 0.0 });
        }
      }

      // sort entries by season id
      gameModeStats.sort((a, b) => (a.name > b.name ? 1 : -1));

      // if someone hasn't played that mode ever don't even bother??
      const lifetimeData = trendData.lifetime;
      if (lifetimeData[gameMode]) {
        const lifetimeAttribute = lifetimeData[gameMode][attributeName];
        const chartName = playerName + "-" + filePrefix + "-" + gameMode;
        const chartTitle = playerName;
        const chartSubTitle = subtitlePrefix + " - " + styleGameMode(gameMode);

        const plotOptions = {
          title: chartTitle,
          subTitle: chartSubTitle,
          data: {
            points: gameModeStats,
            trend: lifetimeAttribute
          }
        };
        createTrendChart(chartName, plotOptions);
      }
    }
  }
}
