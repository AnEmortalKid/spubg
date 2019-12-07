var d3 = require("d3"),
  jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");

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

var myData = [
  { x: 1, y: 6.42 },
  { x: 2, y: 4.48 },
  { x: 3, y: 5.88 },
  { x: 4, y: 7.18 },
  { x: 5, y: 4.95 }
];
const lifetimeKd = 6.12
const yDomainMax = 8

const canvasWidth = 600;
const canvasHeight = 400;
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = canvasWidth - margin.left - margin.right,
  height = canvasHeight - margin.top - margin.bottom;

var xScale = d3
  .scaleLinear()
  .domain([0, 6])
  .range([0, width]);

var yScale = d3
  .scaleLinear()
  .domain([0, yDomainMax])
  .range([height, 0]);

// create svg element:
var svg = d3
.select(document.body)
.append("svg")
.attr("width", canvasWidth)
.attr("height", canvasHeight)

// set a background jic things are black on the image?
svg.append("rect")
.attr("width", "100%")
.attr("height", "100%")
.attr("fill", "white");

var svgCanvas = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add x axis
svgCanvas
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// add y axis
svgCanvas.append("g").call(d3.axisLeft(yScale));

// Add the line
svgCanvas
  .append("path")
  .datum(myData)
  .attr("fill", "none")
  .attr("stroke", "#69b3a2")
  .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .line()
      .x(function(d) {
        return xScale(d.x);
      })
      .y(function(d) {
        return yScale(d.y);
      })
  );
// Add the points
svgCanvas
  .append("g")
  .selectAll("dot")
  .data(myData)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return xScale(d.x);
  })
  .attr("cy", function(d) {
    return yScale(d.y);
  })
  .attr("r", 5)
  .attr("fill", "#69b3a2");

// TODO dynamicize this shit
// goes from x min -> max
// y point is scaled lifetime
var lifetimeX = [0, width ]
// Add the lifetime line
svgCanvas
  .append("path")
  .datum(lifetimeX)
  .attr("fill", "none")
  .attr("stroke", "#ff0000")
  .attr("stroke-width", 1.5)
  .attr(
    "d",
    d3
      .line()
      .x(function(d) {
        return xScale(d);
      })
      .y(yScale(lifetimeKd))
  );


// prepare a helper function
// var lineFunc = d3
//   .line()
//   .x(function(d) {
//     return d.x;
//   })
//   .y(function(d) {
//     return d.y;
//   });

// Add the path using this helper function
// svg
//   .append("path")
//   .attr("d", lineFunc(data))
//   .attr("stroke", "black")
//   .attr("fill", "none");

// serialize our SVG XML to a string.

// svg.node -> g node

var source = xmlserializer.serializeToString(svg.node());
console.log(source);
fs.writeFileSync("out.svg", source);

// TODO figure out why axis are not loading

// svg.node refers to the g so we need to find the parent (which is of type svg and not g)
var imgSource = xmlserializer.serializeToString(svg.node());

svg2img(imgSource, function(error, buffer) {
    //returns a Buffer
    fs.writeFileSync('out.png', buffer);
});
