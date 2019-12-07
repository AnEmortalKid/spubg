
var d3 = require("d3"),
jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require('xmlserializer');
var svg2img = require('svg2img');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;


/**
 *   
 * "squad-fpp": [
    {
      "division.bro.official.pc-2018-01": {
        "kd": "0.85",
        "winRate": "2.53"
      }
    },
    {
      "division.bro.official.pc-2018-02": {
        "kd": "0.94",
        "winRate": "3.88"
      }
    },
    {
      "division.bro.official.pc-2018-03": {
        "kd": "0.93",
        "winRate": "6.76"
      }
    },
    {
      "division.bro.official.pc-2018-04": {
        "kd": "1.00",
        "winRate": "4.84"
      }
    },
    {
      "division.bro.official.pc-2018-05": {
        "kd": "1.00",
        "winRate": "10.14"
      }
    },
    {
      "lifetime": {
        "kd": "0.93",
        "winRate": "4.77"
      }
    }
  ]
 */

// create data
var data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]

// create svg element:
var svg = d3.select(document.body).append("svg").attr("width", 800).attr("height", 200)

// prepare a helper function
var lineFunc = d3.line()
  .x(function(d) { return d.x })
  .y(function(d) { return d.y })

// Add the path using this helper function
svg.append('path')
  .attr('d', lineFunc(data))
  .attr('stroke', 'black')
  .attr('fill', 'none');

// serialize our SVG XML to a string.
var source = xmlserializer.serializeToString(svg.node());
console.log(source)
fs.writeFileSync('out.svg', source);

// svg2img(source, function(error, buffer) {
//     //returns a Buffer
//     fs.writeFileSync('out.png', buffer);
// });