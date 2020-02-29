const Discord = require("discord.js");
import BaseTrendCommand from "./baseTrendCommand";
import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
import { InteractionMode } from "../interactionModes";
import { onFileExistence } from "../../util/fileUtils";

export default class SingleTrendCommand extends BaseTrendCommand {
  constructor(description, attributeName, filePrefix, subtitlePrefix) {
    super(description);
    this._trendOption = {
      attributeName: attributeName,
      filePrefix: filePrefix,
      subtitlePrefix: subtitlePrefix
    };
  }

  execute(commandOptions) {
    const args = commandOptions.args;
    const options = commandOptions.options;

    console.log(`${this._trendOption.attributeName} trend: ${args}`);

    switch (commandOptions.mode) {
      case InteractionMode.CLI:
        return this.cliExecute(args[0], options);
      case InteractionMode.DISCORD:
        return this.discordExecute(args[0], options);
      default:
        throw new Error(`${commandOptions.mode} is not supported`);
    }
  }

  /**
   * Generates and writes charts to the file system
   * @param {String} playerName name of player
   */
  async cliExecute(playerName, options) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);

    var gameModes = supportedGameModes;
    if (options.modes) {
      gameModes = options.modes;
    }

    this.produceTrendCharts(
      playerName,
      trendData,
      gameModes,
      this._trendOption
    );
  }

  async discordExecute(playerName, options) {
    const trendData = await getSeasonAndLifetimeTrend(playerName);
    var gameMode = this.determineGameMode(options);

    const chart = this.createTrendChart(
      playerName,
      trendData,
      gameMode,
      this._trendOption
    );

    const chartName =
      playerName + "-" + this._trendOption.filePrefix + "-" + gameMode;

    chart.createAndWriteTo(chartName, this.getDiscordOutputPath());

    // use the png file path
    const filePath = this.getDiscordOutputPath() + chartName;
    const chartFile = filePath + ".png";

    return new Promise((resolve, reject) => {
      onFileExistence(chartFile, resolve);
    }).then(result => {
      if (result) {
        const file = new Discord.MessageAttachment(chartFile);
        const exampleEmbed = {
          image: {
            url: "attachment://" + chartFile
          }
        };

        return { files: [file] };
      }
      return "uh oh boss";
    });
  }
}
