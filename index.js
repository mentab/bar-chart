req	=	new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload	=	function()
{
	const dataset	=	JSON.parse(req.responseText).data;

	// document.getElementsByClassName('message')[0].innerHTML = JSON.stringify(dataset);

	console.log(dataset);

	const w			=	1200;
    const h			=	600;
    const padding	=	60;
	
	const xScale	=	d3.scaleLinear()
                     		.domain([0, d3.max(dataset, (d, i) => i)])
							.range([padding, w - padding]);
    
    const yScale	=	d3.scaleLinear()
                     		.domain([0, d3.max(dataset, (d) => d[1])])
					 		.range([h - padding, padding]);
 
    const svg		=	d3.select('body')
                			.append('svg')
                			.attr('width', w)
							.attr('height', h);

	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d, i) => xScale(i))
		.attr('y', (d, i) => yScale(d[1]))
		.attr('width', 3)
		.attr('height', (d, i) => h - yScale(d[1]))
    	.attr('fill', 'navy')
		.attr('class', 'bar')
		.attr('data-date', (d) => d[0])
		.attr('data-gdp', (d) => d[1])
		.append('title')
		.attr('data-date', (d) => d[0])
		.text((d) => 'More information for ' + d[0]);

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