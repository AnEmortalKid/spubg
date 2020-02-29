import { styleGameMode } from "../../styling/styler";
import { TrendChart } from "../../chart/trendChart";
import { dataByGameMode, supportedGameModes } from "../../stats/statsAPI";
import BaseCommand from "../baseCommand";
import { InteractionMode } from "../interactionModes";
import { getLocalOutputDirectory } from "../../config/env";
import { defaultDiscordChartMode } from "../commandDefaults";

/**
 * Basic template for a class that can generate trend data
 */
export default class BaseTrendCommand extends BaseCommand {
  constructor(description) {
    super(description);
  }

  commandOptions(interactionMode) {
    switch (interactionMode) {
      case InteractionMode.CLI:
        return this.cliCommandOptions();
      case InteractionMode.DISCORD:
        return this.discordCommandOptions();
      default:
        throw new Error(`${interactionMode} is not supported`);
    }
  }

  cliCommandOptions() {
    const message = `
    --modes the set of game modes to generate a trend chart for.
      By default the game modes are "squad-fpp", "solo-fpp", "duo-fpp".
      ex: --modes squad-fpp duo-fpp
    `;
    return message;
  }

  discordCommandOptions() {
    const message = `
    --modes the set of game modes to generate a trend chart for, only supports a single mode.
      By default the game mode is "squad-fpp".
      ex: --modes duo-fpp
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

  /**
   * Computes and prduces a chart with the trendOption for each game mode
   * @param {String} playerName name of the player
   * @param {Array} trendData data points in the form [seasonalEntries: [], lifetime: [] ]
   * @param {String} gameMode to filter data on
   * @param {Object} trendOption object with attributes { attributeName, filePrefix, subtitlePrefix}
   */
  createTrendChart(playerName, trendData, gameMode, trendOption) {
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
    if (lifetimeData[gameMode]) {
      const lifetimeAttribute = lifetimeData[gameMode][attributeName];
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

      return new TrendChart(plotOptions);
    }

    return null;
  }

  determineGameMode(options) {
    if (!options || !options.modes) {
      return defaultDiscordChartMode();
    }

    const requestedModes = options.modes;

    // find the first non invalid one
    for (const requested of requestedModes) {
      if (supportedGameModes.includes(requested)) {
        return requested;
      }
    }

    return defaultDiscordChartMode();
  }

  getDiscordOutputPath() {
    return getLocalOutputDirectory() + "discord/";
  }
}
