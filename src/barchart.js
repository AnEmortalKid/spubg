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
function createBarChart(fileName, plotOptions) {
  const title = plotOptions.title;
  const subTitle = plotOptions.subTitle;
  const dataPoints = plotOptions.data.points;

  const canvasWidth = 800;
  const canvasHeight = 600;
  var margin = { top: 50, right: 60, bottom: 50, left: 60 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

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
  svgCanvas
    .append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", canvasWidth - (margin.left + margin.right))
    .attr("height", canvasHeight - (margin.top + margin.bottom))
    .attr("stroke", "black")
    .attr("fill", "none");

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


    // set the ranges
var x = d3.scaleBand()
.range([0, width])
.padding(0.25);
var y = d3.scaleLinear()
.range([height, 0]);

// Scale the range of the data in the domains
x.domain(dataPoints.map(function(d) { return d.name; }));
y.domain([0, d3.max(dataPoints, function(d) { return d.value; })]);

// append the rectangles for the bar chart
plotCanvas.selectAll(".bar")
    .data(dataPoints)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("fill", "steelblue")
    .attr("x", function(d) { return x(d.name); })
    .attr("width", x.bandwidth()/2)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });


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

const dataPoints = [
  { name: "2018-01", value: 112.53 },
  { name: "2018-02", value: 129.78 },
  { name: "2018-03", value: 140.03 },
  { name: "2018-04", value: 128.01 },
  { name: "2018-05", value: 122.93 }
];

const plotOptions = {
  title: "Test Bar Chart",
  subTitle: "PlayerName Most Kills",
  data: {
    points: dataPoints
  }
};

createBarChart("testBarChart", plotOptions);
