const yMargin = 40;
const width = 800;
const height = 400;
const barWidth = width / 275;

const svg = d3
  .select('.bar-chart')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

// Fetch GDP data and draw rect
const url =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
d3.json(url)
  .then(function (data) {
    const gdpData = [...data.data];
    console.log(gdpData);
    const scale = d3
      .scaleLinear()
      .domain([0, d3.max(gdpData, (d) => d[1])])
      .range([0, height + 60]);
    const scaledGDP = gdpData.map((d) => scale(d[1]));

    console.log(scaledGDP);
    // draw rect
    svg
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth)
      .attr('height', (d) => d)
      .attr('x', (d, i) => yMargin + i * barWidth)
      .attr('y', (d) => height + 60 - d);
  })
  .catch(function (err) {
    console.log(err);
  });
