import BaseCommand from "../baseCommand";
import { ComparisonChart } from "../../chart/comparisonChart";

import { getSeasonHistory } from "../../stats/statsAPI";

import { styleGameMode, styleSeasonId } from "../../styling/styler";

export default class ComparisonCommand extends BaseCommand {
  constructor(description, comparisonOptions) {
    super(description);
    this.comparisonOptions = comparisonOptions;
  }

  execute(args) {
    console.log(
      `Comparing ${this.comparisonOptions.attributeName} for: ${args}`
    );

    if (args[0]) {
      // TODO filter player names and game-mode
      this.createComparisonChart(
        this.comparisonOptions.title,
        this.comparisonOptions.attributeName,
        args
      );
    }
  }

  /**
   * Gathers attribute values by season for each game mode
   * @param {String} gameModes set of game modes
   * @param {Array} seasonalEntries array of seasonal stats
   * @param {String} attributeName name of the attribute to gather
   */
  dataByGameMode(gameModes, seasonalEntries, attributeName) {
    const stats = {};

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

      stats[gameMode] = gameModeStats;
    }

    return stats;
  }

  async createComparisonChart(chartTitle, attributeName, players) {
    const legitGameModes = ["solo-fpp", "squad-fpp", "duo-fpp"];

    const historyByPlayer = {};

    for (const playerName of players) {
      const historyForPlayer = await getSeasonHistory(playerName);
      const dataForGameMode = this.dataByGameMode(
        legitGameModes,
        historyForPlayer,
        attributeName
      );
      historyByPlayer[playerName] = dataForGameMode;
    }

    for (const gameMode of legitGameModes) {
      this.createAndWrite(chartTitle, gameMode, historyByPlayer);
    }
  }

  createAndWrite(chartTitle, gameMode, historyByPlayer) {
    const dataSet = [];
    const playerNames = Object.keys(historyByPlayer);
    for (const playerName of playerNames) {
      const playerEntry = historyByPlayer[playerName];

      const pointsData = playerEntry[gameMode];

      // create entry for player
      dataSet.push({
        label: playerName,
        points: pointsData
      });
    }

    // prettify the sub title based on game mode
    const plotOptions = {
      title: chartTitle,
      subTitle: styleGameMode(gameMode),
      dataSet: dataSet
    };

    const chart = new ComparisonChart(plotOptions);
    const svgCanvas = chart.create();
    // combine player names
    const fileTitle =
      this.comparisonOptions.attributeName +
      "-Comparison-" +
      playerNames.join("-") +
      gameMode;
    // TODO write charts by type
    chart.writeChart(fileTitle, svgCanvas);
  }
}
