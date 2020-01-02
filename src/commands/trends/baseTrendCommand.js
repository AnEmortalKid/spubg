import { styleSeasonId, styleGameMode } from "../../styling/styler";
import { TrendChart } from "../../chart/trendChart";
import { dataByGameMode, supportedGameModes } from "../../stats/statsAPI";
import BaseCommand from "../baseCommand";

/**
 * Basic template for a class that can generate trend data
 */
export default class BaseTrendCommand extends BaseCommand {
  constructor(description) {
    super(description);
  }

  commandOptions() {
    const message = `
    --modes the set of game modes to generate a trend chart for.
      By default the game modes are "squad-fpp", "solo-fpp", "duo-fpp".
      ex: --modes squad-fpp duo-fpp
    `;
    return message;
  }

  /**
   * Computes and produces charts with the trendOption for each game mode, writing them to the file system
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

    const statsByGameMode = dataByGameMode(
      supportedGameModes,
      seasonalEntries,
      attributeName
    );

    // if someone hasn't played that mode ever don't even bother??
    const lifetimeData = trendData.lifetime;
    for (const gameMode of gameModes) {
      if (lifetimeData[gameMode]) {
        const lifetimeAttribute = lifetimeData[gameMode][attributeName];
        const chartName = playerName + "-" + filePrefix + "-" + gameMode;
        const chartTitle = playerName;
        const chartSubTitle = subtitlePrefix + " - " + styleGameMode(gameMode);

        const plotOptions = {
          title: chartTitle,
          subTitle: chartSubTitle,
          data: {
            points: statsByGameMode[gameMode],
            trend: lifetimeAttribute
          }
        };

        const chart = new TrendChart(plotOptions);
        chart.createAndWrite(chartName);
      }
    }
  }
}
