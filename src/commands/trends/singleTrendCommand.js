const Discord = require("discord.js");
import BaseTrendCommand from "./baseTrendCommand";
import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
import { InteractionMode } from "../interactionModes";
import fs from "fs";

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
    // since we can only send one embed, return a message indicating only one mode is supported

    const trendData = await getSeasonAndLifetimeTrend(playerName);

    // TODO only handle 1 mode

    // 1. clean out/discord
    // 2. write to out/discord
    const chart = this.createTrendChart(
      playerName,
      trendData,
      "squad-fpp",
      this._trendOption
    );

    // todo add game mode
    const chartName =
      playerName + "-" + this._trendOption.filePrefix + "-squad-fpp";

    chart.createAndWriteTo(chartName, "out/discord/");

    // use the png file path
    const filePath = "out/discord/" + chartName;
    const chartFile = filePath + ".png";

    return new Promise((resolve, reject) => {
      this.onFileExistence(chartFile, resolve);
    }).then(result => {
      if (result) {
        const file = new Discord.MessageAttachment(chartFile);
        const exampleEmbed = {
          image: {
            url: "attachment://" + chartFile
          }
        };

        // TODO if
        // TODO add comment around only supporting mode

        // TODO use embed vs not?
        return { files: [file] };
      }
      return "uh oh boss";
    });
  }

  onFileExistence(filePath, callback) {
    var count = 0;
    const limit = 5;
    var exists = false;
    function intervalExists() {
      count++;
      exists = fs.existsSync(filePath);
      if (exists) {
        clearInterval(this);
        callback(exists);
      }
      if (count == limit) {
        clearInterval(this);
        callback(exists);
      }
    }
    setInterval(intervalExists, 1000);
  }
}
