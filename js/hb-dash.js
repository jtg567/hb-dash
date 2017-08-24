var svg = d3.select('svg'),
  margin = {top: 20, right: 80, bottom: 30, left: 50},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var parseDate = d3.timeParse('%Y-%m-%d');

var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10);

// everything in here will run once when the data are loaded
var data;
d3.tsv('./data/hb-dash.tsv', function (error, dataIN) {
  if (error) throw error;

  data = dataIN;
  console.log(data.length);

  const nestByDate = d3.nest().key(d => d3.timeDay(d.datestamp));
  const nestByWeek = d3.nest().key(d => d3.timeDay(d.week));

  // if you have to modify any columns (types, etc.)
  data.forEach(function (d) {
    // d.channel = d.channel;
    // d.os = d.os;
    // d.FxVer = d.FxVer;
    // d.surveyName = d.surveyName;
    d.datestamp = parseDate(d.datestamp);
    // d.week = parseDate(d.week);
    d.score = +d.score;
    d.N = +d.N;
  })

  // set all crossfilter stuff?
  const dat = crossfilter(data);

  // how many of these will actually be static? if it's dynamic, move it to the draw() function?
  x.domain(d3.extent(data, function (d) { return d.datestamp }));

  // // start out with default view (collapse over all other vars)
  // sliceData();
  // draw();
})

function sliceData (data, field, value) {
  return data.filter((d) => {
    return d[field] === value;
  })
}

// expand/collapse separate colored lines for vars beyond (date, score) 
d3.select('#chkFxVer').on('change', updateFxVer);
d3.select('#chkOS').on('change', updateOS);
d3.select('#chkSurveyID').on('change', updateSurveyID);
d3.select('#chkDayWeek').on('change', updateDayWeek);

function updateFxVer () {
  if (d3.select('#chkFxVer').property('checked') == true) {
    console.log('Version Checked'); return;
  }
  if (d3.select('#chkFxVer').property('checked') == false) {
    console.log('Version Unchecked');
  }
}
function updateOS () {
  if (d3.select('#chkOS').property('checked') == true) {
    console.log('OS Checked'); return;
  }
  if (d3.select('#chkOS').property('checked') == false) {
    console.log('OS Unchecked');
  }
}
function updateSurveyID () {
  if (d3.select('#chkSurveyID').property('checked') == true) {
    console.log('SurveyID Checked'); return;
  }
  if (d3.select('#chkSurveyID').property('checked') == false) {
    console.log('SurveyID Unchecked');
  }
}
function updateDayWeek () {
  if (d3.select('#chkDayWeek').property('checked') == true) {
    console.log('DayWeek Checked'); return;
  }
  if (d3.select('#chkDayWeek').property('checked') == false) {
    console.log('DayWeek Unchecked');
  }
}

// I think I need a separate callback to draw with that I'll call when the data change and many of these will be reset there
function draw (data) {
  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.date) })
    .y(function (d) { return y(d.score) });

  y.domain([
    d3.min(data, function (c) { return d3.min(c.values, function (d) { return d.score; }); }),
    d3.max(data, function (c) { return d3.max(c.values, function (d) { return d.score; }); })
  ]);
  z.domain(data.map(function (c) { return c.id; }));

  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y) 
    .orient("left").ticks(5);

  svg.append("path")         // Add the valueline path.
    .attr("d", line(data));

  svg.append("g")                // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")               // Add the Y Axis
    .attr("class", "y axis")
    .call(yAxis);
}
