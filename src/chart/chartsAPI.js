var d3 = require("d3");
var jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;

/**
 *
 * @param {String} fileName name of the file
 * @param {String} title for the plot
 * @param {Array} dataPoints a set of data points in the form: [ { name: "x", value: 5 }]
 * @param {Number} trend the trend point
 */
// TODO turn title into an object
export function createTrendChart(fileName, title, subTitle, dataPoints, trend) {
  const canvasWidth = 600;
  const canvasHeight = 400;
  var margin = { top: 10, right: 60, bottom: 30, left: 60 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

  console.log("datapoints:");
  console.log(dataPoints);

  const pointsColor = "#073a7d";
  const pointsLineColor = "#6c63a9";
  const trendsColor = "#de1d1d";

  var dataPointCount = dataPoints.length;
  var xScale = d3
    .scaleLinear()
    .domain([1, dataPointCount])
    .range([0, width]);

  var yPoints = dataPoints.map(dataPoint => dataPoint.value);
  console.log(yPoints);
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

  const xLabels = dataPoints.map(dataPoint => dataPoint.name);
  console.log(xLabels);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(dataPointCount)
    .tickFormat(function(d, i) {
      return dataPoints[i].name;
    });

  svgCanvas
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("stroke", "#383838")
    .style("font-size", "14px")
    .call(xAxis)
    // hide connection only show values
    .call(g => g.select(".domain").remove());

  // connect the points with a line
  svgCanvas
    .append("path")
    .datum(yPoints)
    .attr("fill", "none")
    .attr("stroke", pointsLineColor)
    .attr("stroke-width", 1.5)
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
  svgCanvas
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
    .attr("r", 10)
    .attr("fill", pointsColor);

  // goes from x min -> max
  // y point is scaled lifetime
  var lifetimeX = [0.75, dataPointCount + 0.25];

  svgCanvas
    .append("path")
    .datum(lifetimeX)
    .attr("fill", "none")
    .attr("stroke", trendsColor)
    .attr("stroke-width", 2)
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
  svgCanvas
    .selectAll("labels")
    .data(yPoints)
    .enter()
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", pointsColor)
    .attr("x", function(d, i) {
      return xScale(i + 1) - 19;
    }) // fontsize + radius
    .attr("y", function(d) {
      var base = yScale(d);
      if (d < trend) {
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
    .attr("y", yScale(trend) - 10)
    .text("(" + trend + ")");

  // Add Main Title
  svgCanvas
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top * 1.5)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text(title);

  svgCanvas
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top * 3.5)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text(subTitle);

  var source = xmlserializer.serializeToString(svg.node());

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
