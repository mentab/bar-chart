req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
	const data = JSON.parse(req.responseText);
	const dataset = data.data;
	const title = data.name;
	const xLabel = data.column_names[0];
	const yLabel = data.column_names[1];

	const parseTime = d3.timeParse("%Y-%m-%d");

	dataset.forEach(function (d) {
		d.push(parseTime(d[0]));
		let date = new Date(d[0]);
		d.push(date.getFullYear() + ' Q' + Math.floor((date.getMonth() + 3) / 3));
		d.push(new Intl.NumberFormat("en-US").format(d[1]));
	});

	const w = 750;
	const h = 400;
	const m = 60;

	const xScale = d3.scaleTime()
		.domain(d3.extent(dataset, (d) => d[2]))
		.range([m, w - m]);

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, (d) => d[1])])
		.range([h - m, m]);

	const content = d3.select('.content');

	content.append('h1')
		.attr('id', 'title')
		.text(title);

	const tooltip = content.append('div')
		.attr('id', 'tooltip')
		.style('position', 'absolute')
		.style('opacity', 0);

	const svg = content.append('svg')
		.attr('width', w)
		.attr('height', h);

	svg.append('text')
		.attr('x', 0)
		.attr('y', 10)
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-90)')
		.attr('font-size', '10px')
		.text(yLabel);

	svg.append('text')
		.attr('x', w)
		.attr('y', h)
		.attr('text-anchor', 'end')
		.attr('font-size', '10px')
		.text(xLabel);

	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d) => xScale(d[2]))
		.attr('y', (d) => yScale(d[1]))
		.attr('width', w / dataset.length)
		.attr('height', (d) => h - yScale(d[1]) - m)
		.attr('fill', 'skyblue')
		.attr('class', 'bar')
		.attr('data-date', (d) => d[0])
		.attr('data-gdp', (d) => d[1])
		.on('mouseover', (d) => {
			tooltip.attr('data-date', d[0])
				.style('left', xScale(d[2]) - 110 + 'px')
				.style('top', yScale(d[1]) - 20 + 'px')
				.style('transition', 'opacity .5s ease-out')
				.style('opacity', .8)
				.html(() => `GDP : <strong>${d[4]}</strong><br/>Date : <em style='color:red'>${d[3]}</em>`);
		})
		.on('mouseout', function () {
			tooltip.style('opacity', 0);
		});

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	svg.append('g')
		.attr('transform', 'translate(0,' + (h - m) + ')')
		.attr('id', 'x-axis')
		.call(xAxis);

	svg.append('g')
		.attr('transform', 'translate(' + m + ', 0)')
		.attr('id', 'y-axis')
		.call(yAxis);
};