import BaseCommand from "../baseCommand";
import { ComparisonChart } from "../../chart/comparisonChart";

import {
  getSeasonHistory,
  dataByGameMode,
  supportedGameModes
} from "../../stats/statsAPI";

import { styleGameMode } from "../../styling/styler";
export default class ComparisonCommand extends BaseCommand {
  constructor(description, comparisonOptions) {
    super(description);
    this.comparisonOptions = comparisonOptions;
  }

  async execute(options) {
    const args = options.args;
    console.log(
      `Comparing ${this.comparisonOptions.attributeName} for: ${args}`
    );

    switch (options.mode) {
      case "cli":
        return this.cliExecute(args);
      default:
        throw new Error(`${options.mode} is not supported`);
    }
  }

  async cliExecute(args) {
    // TODO support filtered game mode
    const playerNames = args;
    const charts = await this.createComparisonCharts(
      this.comparisonOptions.title,
      this.comparisonOptions.attributeName,
      playerNames,
      supportedGameModes
    );

    for (const gameMode of supportedGameModes) {
      const playerNamesString = playerNames.join("-");

      // combine player names
      const fileTitle =
        this.comparisonOptions.attributeName +
        "-" +
        playerNamesString +
        "-" +
        gameMode;

      charts[gameMode].createAndWrite(fileTitle);
    }
  }

  async getHistoryForPlayers(playerNames, attributeName) {
    const historyByPlayer = {};

    for (const playerName of playerNames) {
      const historyForPlayer = await getSeasonHistory(playerName);
      const dataForGameMode = dataByGameMode(
        supportedGameModes,
        historyForPlayer,
        attributeName
      );
      historyByPlayer[playerName] = dataForGameMode;
    }

    return historyByPlayer;
  }

  async createComparisonCharts(chartTitle, attributeName, players, gameModes) {
    const historyByPlayer = await this.getHistoryForPlayers(
      players,
      attributeName
    );

    const charts = {};
    for (const gameMode of gameModes) {
      charts[gameMode] = this.createChart(
        chartTitle,
        gameMode,
        historyByPlayer
      );
    }

    return charts;
  }

  createChart(chartTitle, gameMode, historyByPlayer) {
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
    return chart;
  }
}
