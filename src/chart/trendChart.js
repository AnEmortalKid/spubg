import BaseChart from "./baseChart";
import { squadPlayerColors } from "../styling/styler";

var d3 = require("d3");
var jsdom = require("jsdom");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;

// turn for debug or not
const debug = false;

function addKey(svgCanvas, keyOptions) {
  const margin = keyOptions.margin;
  const trendsColor = keyOptions.trendsColor;

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
}

function plotDataPoints(plotCanvas, dataValues, trend, dataPointOptions) {
  const pointsRadius = dataPointOptions.radius;
  const lineThickness = dataPointOptions.connectionThickness;
  const xScale = dataPointOptions.xScale;
  const yScale = dataPointOptions.yScale;
  const nodeFontSize = dataPointOptions.nodeFontSize;
  const color = dataPointOptions.color;

  // connect the points with a line
  plotCanvas
    .append("path")
    .datum(dataValues)
    .attr("fill", "none")
    .attr("stroke", color)
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
    .data(dataValues)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return xScale(i + 1);
    })
    .attr("cy", function(d) {
      return yScale(d);
    })
    .attr("r", pointsRadius)
    .attr("fill", color);

  plotCanvas
    .selectAll("labels")
    .data(dataValues)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", color)
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
}

export class TrendChart extends BaseChart {
  constructor(chartOptions) {
    super("trend");
    this.chartOptions = chartOptions;
  }

  create() {
    const title = this.chartOptions.title;
    const subTitle = this.chartOptions.subTitle;

    const dataPoints = this.chartOptions.data.points;
    const trend = this.chartOptions.data.trend;

    const canvasWidth = 800;
    const canvasHeight = 600;
    var margin = { top: 50, right: 60, bottom: 50, left: 60 },
      width = canvasWidth - margin.left - margin.right,
      height = canvasHeight - margin.top - margin.bottom;

    const lineThickness = 2;
    const pointsRadius = 5;

    var dataPointCount = dataPoints.length;
    var xScale = d3
      .scaleLinear()
      .domain([1, dataPointCount])
      .range([0, width]);

    var yPoints = dataPoints.map(dataPoint => dataPoint.value);
    var minYPoint = d3.min(yPoints);
    const maxYPoint = d3.max(yPoints);

    var yScale = d3
      .scaleLinear()
      // .domain([minYPoint - yBufferShift, maxYPoint + yBufferShift])
      .domain([minYPoint, maxYPoint])
      .range([height, margin.top]);

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
    if (debug) {
      svgCanvas
        .append("rect")
        .attr("x", margin.left)
        .attr("y", keyBoxYBound)
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("fill", "none");
    }

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

    addKey(svgCanvas, {
      margin: margin,
      trendsColor: squadPlayerColors.orange
    });

    // canvas for the plot elements
    var plotCanvas = svgCanvas
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    plotDataPoints(plotCanvas, yPoints, trend, {
      radius: pointsRadius,
      connectionThickness: lineThickness,
      xScale: xScale,
      yScale: yScale,
      nodeFontSize: 14,
      color: squadPlayerColors.blue
    });

    // goes from x min -> max
    // y point is scaled lifetime
    var lifetimeX = [0.75, dataPointCount + 0.25];

    plotCanvas
      .append("path")
      .datum(lifetimeX)
      .attr("fill", "none")
      .attr("stroke", squadPlayerColors.orange)
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

    return svgCanvas;
  }
}
