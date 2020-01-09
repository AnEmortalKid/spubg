import { getLocalOutputDirectory } from "../config/env";

var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");

const baseOutputPath = getLocalOutputDirectory() + "charts";

export default class BaseChart {
  constructor(typeDirectory) {
    this.typeDirectory = typeDirectory;
  }

  /**
   * Creates a canvas with the chart data
   * @return SVG Canvas with the chart
   */
  create() {
    throw new Error("Unimplemented!");
  }

  /**
   * Generates and writes the chart to the configured output path
   * @param {String} fileName name of the file
   */
  createAndWrite(fileName) {
    const svgCanvas = this.create();
    var source = xmlserializer.serializeToString(svgCanvas.node());
    const typeOutputDir = baseOutputPath + "/" + this.typeDirectory + "/";
    const filePath = typeOutputDir + fileName;

    fs.mkdirSync(typeOutputDir, { recursive: true }, err => {
      if (err) throw err;
    });

    fs.writeFileSync(`${filePath}.svg`, source);

    svg2img(source, function(error, buffer) {
      //returns a Buffer
      fs.writeFileSync(`${filePath}.png`, buffer);
      if (error) {
        console.log(error);
      }
    });

    console.log(`Wrote to ${filePath}`);
  }
}
