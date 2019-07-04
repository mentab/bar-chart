req	=	new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload	=	function()
{
	const dataset	=	JSON.parse(req.responseText).data;

	document.getElementsByClassName('message')[0].innerHTML = JSON.stringify(dataset);

	const w			=	200;
    const h			=	500;
    const padding	=	60;
    
    const svg		=	d3.select('body')
                		.append('svg')
                		.attr('width', w)
						.attr('height', h)
						.attr('fill', 'red');

	svg.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	.attr('x', (d, i) => i * 5)
	.attr('y', (d, i) => h - d[1])
	.attr('width', 5)
	.attr('height', (d, i) => d[1])
    .attr('fill', 'navy')
    .attr('class', 'bar');
};