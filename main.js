const width = 800;
const height = 400;
const barWidth = width / 275;

const tooltip = d3
  .select('.bar-chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', '0');

const svg = d3
  .select('.bar-chart')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

// Fetch GDP data and draw rect
const url =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
d3.json(url)
  .then((data) => {
    // Scale GDP data
    const gdpMax = d3.max(data.data, (item) => item[1]);
    const gdpScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);
    const scaledGDP = data.data.map((item) => gdpScale(item[1]));
    // Scale Y axis
    const yScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    // Scale year data
    const yearsDate = data.data.map((item) => new Date(item[0]));
    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    const xMin = d3.min(yearsDate);
    const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);

    // Draw X axis
    const xAxis = d3.axisBottom().scale(xScale);
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(60, ${height})`)
      .call(xAxis);

    // Draw Y axis
    const yAxis = d3.axisLeft().scale(yScale);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)')
      .call(yAxis)
      .append('text');

    // Vertical Y axis label
    svg
      .append('text')
      .text('Gross Domestic Product')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80);

    // Parse year data for tooltip
    const years = data.data.map((item) => {
      const temp = item[0].substring(5, 7);
      let quarter = '';
      switch (temp) {
        case '01':
          quarter = 'Q1';
          break;
        case '04':
          quarter = 'Q2';
          break;
        case '07':
          quarter = 'Q3';
          break;
        case '10':
          quarter = 'Q4';
          break;
      }
      return `${item[0].substring(0, 4)} ${quarter}`;
    });

    // Draw rect
    svg
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('data-date', (d, i) => data.data[i][0])
      .attr('data-gdp', (d, i) => data.data[i][1])
      .attr('class', 'bar')
      .attr('width', barWidth)
      .attr('height', (d) => d)
      .attr('x', (d, i) => xScale(yearsDate[i]))
      .attr('y', (d) => height - d)
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', (d, i) => {
        const gdp = data.data[i][1]
          .toFixed(1)
          .replace(/(^\d)(?=\d{3,})/, '$1,');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${years[i]}<br>$${gdp} Billion`)
          .attr('data-date', data.data[i][0])
          .style('left', `${i * barWidth + 30}px`)
          .style('top', `${height - 50}px`)
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(300).style('opacity', 0);
      });
  })
  .catch((err) => {
    console.log(err);
  });
