var d3 = require("d3");
var jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;

import { squadPlayerColors } from "../styling/styler";

/**
 *
 * @param {String} fileName name of the file
 * @param {Object} plotOptions an object containing:
 * {
 *  title: String,
 *  subTitle: String,
 *  data: {
 *    points: [ { name: "x", value: 5 }]
 *    trend: Number
 *  }
 * }
 */
export function createTrendChart(fileName, plotOptions) {
  const title = plotOptions.title;
  const subTitle = plotOptions.subTitle;
  const dataPoints = plotOptions.data.points;
  const trend = plotOptions.data.trend;

  const canvasWidth = 800;
  const canvasHeight = 600;
  var margin = { top: 50, right: 60, bottom: 50, left: 60 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

  console.log("datapoints:");
  console.log(dataPoints);

  const pointsColor = squadPlayerColors.blue;
  const pointsLineColor = squadPlayerColors.blue;
  const trendsColor = squadPlayerColors.orange;
  const lineThickness = 2;
  const pointsRadius = 5;

  var dataPointCount = dataPoints.length;
  var xScale = d3
    .scaleLinear()
    .domain([1, dataPointCount])
    .range([0, width]);

  var yPoints = dataPoints.map(dataPoint => dataPoint.value);
  console.log(yPoints);
  var minYPoint = d3.min(yPoints);
  const maxYPoint = d3.max(yPoints);

  var yScale = d3
    .scaleLinear()
    // .domain([minYPoint - yBufferShift, maxYPoint + yBufferShift])
    .domain([minYPoint, maxYPoint])
    .range([height, margin.top + margin.bottom]);

  // create svg element:
  var svgCanvas = d3
    .select(document.body)
    .append("svg")
    .attr("width", canvasWidth)
    .attr("height", canvasHeight);

  // set a background jic things are black on the image?
  svgCanvas
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("stroke", "black")
    .attr("fill", "white");

  // create a border on the area that would be the draw area for debugging
  // svgCanvas.append("rect")
  // .attr("x", margin.left)
  // .attr("y", margin.top)
  // .attr("width", canvasWidth-(margin.left+margin.right))
  // .attr("height", canvasHeight - (margin.top+margin.bottom))
  // .attr("stroke", "black")
  // .attr("fill", "none");

  // Add Main Title
  svgCanvas
    .append("text")
    .attr("x", canvasWidth / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text(title);

  svgCanvas
    .append("text")
    .attr("x", canvasWidth / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(subTitle);

  // create a key on the left
  const keyBoxX = margin.left / 2;
  const keyBoxY = margin.top / 2;
  const keyBoxSize = 15;

  svgCanvas
    .append("rect")
    .attr("x", margin.left / 2)
    .attr("y", margin.top / 2)
    .attr("width", keyBoxSize)
    .attr("height", keyBoxSize)
    .attr("stroke-widrth", 1)
    .attr("stroke", "black")
    .attr("fill", trendsColor);

  svgCanvas
    .append("text")
    .attr("x", keyBoxX + keyBoxSize * 1.5)
    .attr("y", keyBoxY + keyBoxSize * 0.75)
    .attr("font-size", "12px")
    .text("Lifetime");

  // canvas for the plot elements
  var plotCanvas = svgCanvas
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xLabels = dataPoints.map(dataPoint => dataPoint.name);
  console.log(xLabels);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(dataPointCount)
    .tickFormat(function(d, i) {
      return dataPoints[i].name;
    });

  // position axis in the middle of the allowable margin
  const xAxis_yPositioning = height + margin.bottom / 2;
  plotCanvas
    .append("g")
    .attr("transform", "translate(0," + xAxis_yPositioning + ")")
    .style("stroke", "#383838")
    .style("font-size", "14px")
    .call(xAxis)
    // hide connection only show values
    .call(g => g.select(".domain").remove());

  // connect the points with a line
  plotCanvas
    .append("path")
    .datum(yPoints)
    .attr("fill", "none")
    .attr("stroke", pointsLineColor)
    .attr("stroke-width", lineThickness)
    .attr(
      "d",
      d3
        .line()
        .x(function(d, i) {
          return xScale(i + 1);
        })
        .y(function(d) {
          return yScale(d);
        })
    );

  // Add the points
  plotCanvas
    .append("g")
    .selectAll("dot")
    .data(yPoints)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return xScale(i + 1);
    })
    .attr("cy", function(d) {
      return yScale(d);
    })
    .attr("r", pointsRadius)
    .attr("fill", pointsColor);

  // goes from x min -> max
  // y point is scaled lifetime
  var lifetimeX = [0.75, dataPointCount + 0.25];

  plotCanvas
    .append("path")
    .datum(lifetimeX)
    .attr("fill", "none")
    .attr("stroke", trendsColor)
    .attr("stroke-width", lineThickness)
    .attr(
      "d",
      d3
        .line()
        .x(function(d) {
          return xScale(d);
        })
        .y(yScale(trend))
    );

  // label each node
  const nodeFontSize = 14;
  plotCanvas
    .selectAll("labels")
    .data(yPoints)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", pointsColor)
    .attr("x", function(d, i) {
      return xScale(i + 1) - pointsRadius;
    }) // fontsize + radius
    .attr("y", function(d) {
      var base = yScale(d);
      if (d < trend) {
        base += nodeFontSize + pointsRadius;
      } else {
        base -= nodeFontSize - pointsRadius;
      }
      return base;
    })
    .text(function(d) {
      return "(" + d + ")";
    });

  // add the lifetime trend text
  plotCanvas
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", "18px")
    .attr("fill", "#e36666")
    .attr("text-anchor", "middle")
    .attr("x", xScale(5))
    .attr("y", yScale(trend) - 10)
    .text("(" + trend + ")");

  var source = xmlserializer.serializeToString(svgCanvas.node());

  const filePath = "out/charts/" + fileName;
  fs.mkdir("out/charts", { recursive: true }, err => {
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
}
