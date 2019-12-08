var d3 = require("d3"),
  jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");
var btoa = require("btoa");

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;

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

// var myData = [
//   { x: 1, y: 2.53 },
//   { x: 2, y: 3.88 },
//   { x: 3, y: 6.76 },
//   { x: 4, y: 4.84 },
//   { x: 5, y: 10.14 }
// ];
// const lifetimeKd = 4.77

// const yDomainMax = 12;

// TROPODs

/**
 *  "squad-fpp": [
    {
      "division.bro.official.pc-2018-01": {
        "kd": "0.96",
        "winRate": "10.42"
      }
    },
    {
      "division.bro.official.pc-2018-02": {
        "kd": "1.52",
        "winRate": "18.56"
      }
    },
    {
      "division.bro.official.pc-2018-03": {
        "kd": "1.39",
        "winRate": "16.13"
      }
    },
    {
      "division.bro.official.pc-2018-04": {
        "kd": "1.13",
        "winRate": "2.84"
      }
    },
    {
      "division.bro.official.pc-2018-05": {
        "kd": "1.38",
        "winRate": "12.87"
      }
    },
    {
      "lifetime": {
        "kd": "1.30",
        "winRate": "11.93"
      }
    }

 */

// var myData = [
//   { x: 1, y: 10.42 },
//   { x: 2, y: 18.56 },
//   { x: 3, y: 16.13 },
//   { x: 4, y: 2.84 },
//   { x: 5, y: 12.87 }
// ];
// const lifetimeKd = 11.93

// const yDomainMax = 20

/**
 * DIRTYG
 *   "squad-fpp": [
    {
      "division.bro.official.pc-2018-01": {
        "kd": "1.45",
        "winRate": "6.42"
      }
    },
    {
      "division.bro.official.pc-2018-02": {
        "kd": "1.97",
        "winRate": "4.48"
      }
    },
    {
      "division.bro.official.pc-2018-03": {
        "kd": "1.65",
        "winRate": "5.88"
      }
    },
    {
      "division.bro.official.pc-2018-04": {
        "kd": "1.61",
        "winRate": "7.18"
      }
    },
    {
      "division.bro.official.pc-2018-05": {
        "kd": "1.45",
        "winRate": "4.95"
      }
    },
    {
      "lifetime": {
        "kd": "1.59",
        "winRate": "6.12"
      }
    }
 */

// SeasonData

//  "division.bro.official.pc-2018-01": {
//   "kd": "1.45",
//   "winRate": "6.42"
// }

/**
 * 
 * @param {String} title 
 * @param {Array} seasonData an array of objects with seasonId and statValue, e.g. [ { seasonId: "season1", statValue: 5 }, { seasonId: "season2", statValue: 3 }]
 * @param {Number} allTimeHighValue 
 */
function createPlot(title, seasonData, allTimeHighValue) {
  const canvasWidth = 600;
  const canvasHeight = 400;
  var margin = { top: 10, right: 60, bottom: 30, left: 60 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

  var dataPointCount = seasonData.length;
  var xScale = d3
    .scaleLinear()
    .domain([1, dataPointCount])
    .range([0, width]);

  var yPoints = seasonData.map(seasonItem => seasonItem.statValue);
  console.log(yPoints)
  var minYPoint = d3.min(yPoints);
  const maxYPoint = d3.max(yPoints);
  const yBufferShift = 0.75;

  var yScale = d3
    .scaleLinear()
    .domain([minYPoint - yBufferShift, maxYPoint + yBufferShift])
    .range([height, 0]);

  // create svg element:
  var svg = d3
    .select(document.body)
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  // set a background jic things are black on the image?
  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("stroke", "black")
    .attr("fill", "white");

  var svgCanvas = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add x axis
  const seasonNames = seasonData.map(seasonItem => seasonItem.seasonId.replace("division.bro.official.pc-", ""));
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(function(d,i) {
      return seasonNames[i];
    })
    .ticks(dataPointCount);

  svgCanvas
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("stroke", "#383838")
    .call(xAxis)
    .call(g => g.select(".domain").remove()); // hide connection only show values

  // Add the line
  svgCanvas
    .append("path")
    .datum(yPoints)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function(d,i) {
          return xScale(i+1);
        })
        .y(function(d) {
          return yScale(d);
        })
    );

  // Add the points
  svgCanvas
    .append("g")
    .selectAll("dot")
    .data(yPoints)
    .enter()
    .append("circle")
    .attr("cx", function(d,i) {
      return xScale(i+1);
    })
    .attr("cy", function(d) {
      return yScale(d);
    })
    .attr("r", 10)
    .attr("fill", "#69b3a2");

  // goes from x min -> max
  // y point is scaled lifetime
  var lifetimeX = [0.75, dataPointCount+.25];
  // Add the lifetime line
  svgCanvas
    .append("path")
    .datum(lifetimeX)
    .attr("fill", "none")
    .attr("stroke", "#e36666")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x(function(d) {
          return xScale(d);
        })
        .y(yScale(allTimeHighValue))
    );


  // label each node
  svgCanvas
    .selectAll("labels")
    .data(yPoints)
    .enter()
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "#0f544b")
    .attr("x", function(d, i) {
      return xScale(i + 1) - 19;
    }) // fontsize + radius
    .attr("y", function(d) {
      var base = yScale(d);
      if (d < allTimeHighValue) {
        // shift down by 2x fontsize
        base += 28;
      } else {
        // shift up by fontsize
        base -= 14;
      }
      return base;
    })
    .text(function(d) {
      return "(" + d + ")";
    });

  // add the lifetime trend text
  svgCanvas
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", "18px")
    .attr("fill", "#e36666")
    .attr("x", xScale(5))
    .attr("y", yScale(allTimeHighValue) - 10)
    .text("(" + allTimeHighValue + ")");

  var source = xmlserializer.serializeToString(svg.node());
  fs.writeFileSync(`${title}.svg`, source);

  svg2img(source, function(error, buffer) {
    //returns a Buffer
    fs.writeFileSync(`${title}.png`, buffer);
  });
}

const winRateData = [{"seasonId":"division.bro.official.pc-2018-01","statValue":6.42},
{"seasonId":"division.bro.official.pc-2018-02","statValue":4.48},
{"seasonId":"division.bro.official.pc-2018-03","statValue":5.88},
{"seasonId":"division.bro.official.pc-2018-04","statValue":7.18},
{"seasonId":"division.bro.official.pc-2018-05","statValue":4.95}]

const lifeTimeWinRate = 6.12

// TODO add desired title text

createPlot("test", winRateData, lifeTimeWinRate);
