const Discord = require("discord.js");
import BaseTrendCommand from "./baseTrendCommand";
import {
  getSeasonAndLifetimeTrend,
  supportedGameModes
} from "../../stats/statsAPI";
import { InteractionMode } from "../interactionModes";

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

    // TODO poll every sec for 5 secs
    // poll every second for up to 5 seconds then return a womp womp

    const filePath = "out/discord/" + chartName;

    const file = new Discord.MessageAttachment(filePath + ".png");
    const exampleEmbed = {
      image: {
        url: "attachment://" + filePath + ".png"
      }
    };

    return { files: [file], embed: exampleEmbed };
  }
}
