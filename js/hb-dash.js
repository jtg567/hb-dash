var svg = d3.select('svg'),
  margin = {top: 20, right: 80, bottom: 30, left: 50},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var parseDate = d3.timeParse('%Y-%m-%d')

var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeCategory10)

var line = d3.line()
  .curve(d3.curveBasis)
  .x(function (d) { return x(d.date) })
  .y(function (d) { return y(d.score) })

// everything in here will run once when the data are loaded
d3.tsv('./data/hb-dash-daily.tsv', function (error, data) {
  if (error) throw error

  console.log(data.length)

  const nestByDate = d3.nest().key(d => d3.timeDay(d.datestamp))
  const nestByWeek = d3.nest().key(d => d3.timeDay(d.week))

  // if you have to modify any columns (types, etc.)
  data.forEach(function (d) {
    // d.channel = d.channel;
    // d.os = d.os;
    // d.FxVer = d.FxVer;
    // d.surveyName = d.surveyName;
    d.datestamp = parseDate(d.datestamp)
    d.week = parseDate(d.week)
    d.score = +d.score
    d.N = +d.N
  })

  // set all crossfilter stuff?
  const dat = crossfilter(data)

  // how many of these will actually be static?
  x.domain(d3.extent(data, function (d) { return d.datestamp }))
  // y.domain([
  //   d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.score; }); }),
  //   d3.max(data, function(c) { return d3.max(c.values, function(d) { return d.score; }); })
  // ]);
  // z.domain(cities.map(function(c) { return c.id; }));

  // start out with default view (collapse over all other vars)
  draw
})

// expand/collapse separate colored lines for vars beyond (date, score) 
d3.select('#chkFxVer').on('change', updateFxVer)
d3.select('#chkOS').on('change', updateOS)
d3.select('#chkSurveyID').on('change', updateSurveyID)
d3.select('#chkDayWeek').on('change', updateDayWeek)

function updateFxVer () {
  if (d3.select('#chkFxVer').property('checked') == true) {
    console.log('Version Checked'); return
  }
  if (d3.select('#chkFxVer').property('checked') == false) {
    console.log('Version Unchecked')
  }
}
function updateOS () {
  if (d3.select('#chkOS').property('checked') == true) {
    console.log('OS Checked'); return
  }
  if (d3.select('#chkOS').property('checked') == false) {
    console.log('OS Unchecked')
  }
}
function updateSurveyID () {
  if (d3.select('#chkSurveyID').property('checked') == true) {
    console.log('SurveyID Checked'); return
  }
  if (d3.select('#chkSurveyID').property('checked') == false) {
    console.log('SurveyID Unchecked')
  }
}
function updateDayWeek () {
  if (d3.select('#chkDayWeek').property('checked') == true) {
    console.log('DayWeek Checked'); return
  }
  if (d3.select('#chkDayWeek').property('checked') == false) {
    console.log('DayWeek Unchecked')
  }
}

// I think I need a separate callback to draw with that I'll call when the data change and many of these will be reset there
function draw () {

}
