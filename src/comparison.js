var d3 = require("d3");
var jsdom = require("jsdom");
var fs = require("fs");
var xmlserializer = require("xmlserializer");
var svg2img = require("svg2img");

const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;

function getAllPoints(dataSet) {
  const allPoints = [];
  for (const data of dataSet) {
    data.points.map(x => x.value).forEach(x => allPoints.push(x));
  }

  return allPoints;
}

/**
 *
 * @param {String} fileName name of the file
 * @param {Object} plotOptions an object containing:
 * {
 *  title: String,
 *  subTitle: String,
 *  dataset: [
 *   {
 *     points: [ { name: "x", value: 5 }]
 *     label: "some name"
 *   },
 *   {
 *     points: [ { name: "x", value: 5 }]
 *     label: "some name"
 *   },
 *
 *      ]
 *    trend: Number
 *  }
 * }
 */
function createComparisonChart(fileName, plotOptions) {
  const title = plotOptions.title;
  const subTitle = plotOptions.subTitle;

  const dataSet = plotOptions.dataSet;
  console.log(`dataSet: ${dataSet}`);

  // TODO limit color set to 4

  const canvasWidth = 800;
  const canvasHeight = 600;
  var margin = { top: 50, right: 60, bottom: 50, left: 60 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

  const pointsColor = "#073a7d";
  const pointsLineColor = "#6c63a9";
  const lineThickness = 2;
  const pointsRadius = 5;

  // scale should be the same across datasets, so take the first one
  const firstDataPoints = dataSet[0].points;
  var dataPointCount = firstDataPoints.length;
  var xScale = d3
    .scaleLinear()
    .domain([1, dataPointCount])
    .range([0, width]);

  // y scale is across all of them

  var yPoints = getAllPoints(dataSet);
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

  // TODO add each person
  // create a key on the left
  const keyBoxX = margin.left / 2;
  const keyBoxY = margin.top / 2;
  const keyBoxSize = 15;

  // TODO create based on colors

  //   svgCanvas
  //     .append("rect")
  //     .attr("x", margin.left / 2)
  //     .attr("y", margin.top / 2)
  //     .attr("width", keyBoxSize)
  //     .attr("height", keyBoxSize)
  //     .attr("stroke-widrth", 1)
  //     .attr("stroke", "black")
  //     .attr("fill", trendsColor);

  //   svgCanvas
  //     .append("text")
  //     .attr("x", keyBoxX + keyBoxSize * 1.5)
  //     .attr("y", keyBoxY + keyBoxSize * 0.75)
  //     .attr("font-size", "12px")
  //     .text("Lifetime");

  // canvas for the plot elements
  var plotCanvas = svgCanvas
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xLabels = firstDataPoints.map(dataPoint => dataPoint.name);
  console.log(xLabels);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(dataPointCount)
    .tickFormat(function(d, i) {
      return firstDataPoints[i].name;
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

    // TODO y axis

  // TODO for each person

  const colorSet = [ 
    {
        pointsColor: "#007fba",
        lineColor: "#007fba"
    },
    {
        pointsColor: "orange",
        lineColor: "orange"
    },
    {
        pointsColor: "green",
        lineColor: "green"
    },
    {
        pointsColor: "blue",
        lineColor: "blue"
    }
]
    var colorIndex = 0;
  for (const dataEntry of dataSet) {
    const color = colorSet[colorIndex];
    colorIndex++;

    const dataPoints = dataEntry.points;
    const dataValues = dataPoints.map(x => x.value);

    console.log("plotting:" + dataValues);

    // connect the points with a line
    plotCanvas
      .append("path")
      .datum(dataValues)
      .attr("fill", "none")
      .attr("stroke", color.lineColor)
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
      .attr("fill", color.pointsColor);
  }

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

const dataSet = [
  {
    points: [
      { name: "2018-01", value: 112.53 },
      { name: "2018-02", value: 129.78 },
      { name: "2018-03", value: 140.03 },
      { name: "2018-04", value: 128.01 },
      { name: "2018-05", value: 122.93 }
    ]
  },
  {
    points: [
      { name: "2018-01", value: 50.0 },
      { name: "2018-02", value: 180.5 },
      { name: "2018-03", value: 209.15 },
      { name: "2018-04", value: 129.0 },
      { name: "2018-05", value: 230.3 }
    ]
  },
  {
    points: [
      { name: "2018-01", value: 109.23 },
      { name: "2018-02", value: 129.78 },
      { name: "2018-03", value: 143.0 },
      { name: "2018-04", value: 25.0 },
      { name: "2018-05", value: 88.0 }
    ]
  }
];

const plotOptions = {
  title: "test",
  subTitle: "testsub",
  dataSet: dataSet
};

createComparisonChart("testComparison", plotOptions);
