import BaseCommand from "../baseCommand";
import { ComparisonChart } from "../../chart/comparisonChart";

import {
  getSeasonHistory,
  dataByGameMode,
  supportedGameModes
} from "../../stats/statsAPI";

import { styleGameMode } from "../../styling/styler";
import { InteractionMode } from "../interactionModes";
export default class ComparisonCommand extends BaseCommand {
  constructor(description, comparisonOptions) {
    super(description);
    this.comparisonOptions = comparisonOptions;
  }

  commandOptions(interactionMode) {
    switch (interactionMode) {
      case InteractionMode.CLI:
        return this.cliCommandOptions();
      case InteractionMode.DISCORD:
        return this.discordCommandOptions();
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
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

  async execute(commandOptions) {
    const args = commandOptions.args;
    const options = commandOptions.options;

    console.log(
      `Comparing ${this.comparisonOptions.attributeName} for: ${args}`
    );

    switch (commandOptions.mode) {
      case InteractionMode.CLI:
        return this.cliExecute(args, options);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  async cliExecute(playerNames, options) {
    var gameModes = supportedGameModes;
    if (options.modes) {
      gameModes = options.modes;
    }

    const charts = await this.createComparisonCharts(
      this.comparisonOptions.title,
      this.comparisonOptions.attributeName,
      playerNames,
      gameModes
    );

    for (const gameMode of gameModes) {
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
