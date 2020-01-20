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

    // TODO turn this into a function with 'writeToFile' expecting the creation if it
    // const svgCanvas = chart.create();
    // var source = xmlserializer.serializeToString(svgCanvas.node());
    // const typeOutputDir = baseOutputPath + "/" + this.typeDirectory + "/";
    // const filePath = typeOutputDir + fileName;

    // fs.mkdirSync(typeOutputDir, { recursive: true }, err => {
    //   if (err) throw err;
    // });

    // fs.writeFileSync(`${filePath}.svg`, source);

    // svg2img(source, function(error, buffer) {
    //   //returns a Buffer
    //   fs.writeFileSync(`${filePath}.png`, buffer);
    //   if (error) {
    //     console.log(error);
    //   }
    // });

    // console.log(`Wrote to ${filePath}`);

    // TODO build attachment
    /**
     * const file = new Discord.MessageAttachment('./out.png');

        const exampleEmbed = {
          title: 'Some title',
          image: {
            url: 'attachment://out.png',
          },
        };
     */
  }
}
