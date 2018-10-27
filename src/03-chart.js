import * as d3 from 'd3'

var margin = { top: 10, left: 10, right: 10, bottom: 10 }

var height = 480 - margin.top - margin.bottom

var width = 480 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

var angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var container = svg.append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })



 d3.select('#nyc').on('stepin', () => {
  // Filter it so I'm only looking at NYC datapoints
  let nycDatapoints = datapoints.filter(d => d.city === 'NYC')
  nycDatapoints.push(nycDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycDatapoints)
    .attr('d', line)
    .attr('fill', 'black')
    .attr('opacity', 0.75)

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')

 })
//Nää saa katoamaan jollain rebind /exit-jutulla joka me tehtiin tunnilla sano TA
  d3.select('#beijing').on('stepin', () => {
      let beijingDatapoints = datapoints.filter(d => d.city === 'Beijing')
  beijingDatapoints.push(beijingDatapoints[0])

  container
    .append('path')
    .attr('class', 'temp')
    .datum(beijingDatapoints)
    .attr('d', line)
    .attr('fill', 'black')
    .attr('opacity', 0.75)

   container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('Beijing')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')
  })



  var circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  var textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()


  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

}
