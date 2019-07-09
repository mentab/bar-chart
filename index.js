req	=	new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload	=	function()
{
	const data		=	JSON.parse(req.responseText);
	const dataset	=	data.data;
	const title		=	data.name;
	
	const parseTime	=	d3.timeParse("%Y-%m-%d")

	dataset.forEach(function(d) {
		d.push(parseTime(d[0]));
	});

	const w			=	800;
    const h			=	500;
    const padding	=	60;
	
	const xScale	=	d3.scaleTime()
                     		.domain(d3.extent(dataset, (d) => d[2]))
							.range([padding, w - padding]);
    
    const yScale	=	d3.scaleLinear()
                     		.domain([0, d3.max(dataset, (d) => d[1])])
					 		.range([h - padding, padding]);
 
	const tip		=	d3.tip()
							.attr('id', 'tooltip')
							.offset([-10, 0])
							.html((d) => {
								d3.select('#tooltip').attr('data-date', d[0]);
								return `<strong>More information for:</strong>&nbsp;<span style="color:red">${d[0]}</span>`;
							});

	d3.select('.content')
		.append('h1')
		.attr('id', 'title')
		.text(title);						
					

    const svg		=	d3.select('.content')
                			.append('svg')
                			.attr('width', w)
							.attr('height', h);

	svg.call(tip);

	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d, i) => xScale(d[2]))
		.attr('y', (d, i) => yScale(d[1]))
		.attr('width', w / dataset.length)
		.attr('height', (d) => h - padding - yScale(d[1]))
    	.attr('fill', 'skyblue')
		.attr('class', 'bar')
		.attr('data-date', (d) => d[0])
		.attr('data-gdp', (d) => d[1])
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	const xAxis		=	d3.axisBottom(xScale);
	const yAxis		=	d3.axisLeft(yScale);

	svg.append('g')
		.attr('transform', 'translate(0,' + (h - padding) + ')')
		.attr('id', 'x-axis')
		.call(xAxis);
		
	svg.append('g')
    	.attr('transform', 'translate('+ padding + ', 0)')
		.attr('id', 'y-axis')
		.call(yAxis);
};