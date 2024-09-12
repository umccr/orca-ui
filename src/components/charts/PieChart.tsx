import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  data: { name: string; value: number }[];
  width: number;
  height: number;
}

interface ArcData {
  data: {
    name: string;
    value: number;
  };
  startAngle: number;
  endAngle: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
  const ref = useRef<SVGSVGElement>(null);
  function calcTranslate(data: ArcData, move = 5) {
    const moveAngle = data.startAngle + (data.endAngle - data.startAngle) / 2;
    return `translate(${-move * Math.cos(moveAngle + Math.PI / 2)}, ${-move * Math.sin(moveAngle + Math.PI / 2)})`;
  }
  useEffect(() => {
    if (!data) return;

    const radius = height / 2 - 10;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `-${width / 2 - 100} -${height / 2} ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    // const color: ScaleOrdinal<string, string> = d3
    //   .scaleOrdinal<string>()
    //   .domain(data.map((d) => d.name))
    //   .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((item) => item.name))
      .range(d3.schemeTableau10);

    const arc = d3
      .arc<ArcData>()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3
      .pie<{ name: string; value: number }>()
      .padAngle(2 / radius)
      .sort(null)
      .value((d) => d.value);

    const duration = 200;

    // Tooltip setup
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('font-size', '12px')
      .style('position', 'absolute')
      .style('padding', '3px')
      .style('border', 'none')
      .style('border-radius', '5px')
      .style('pointer-events', 'none');

    // build arcs
    svg
      .append('g')
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('fill', (d) => colorScale(d.data.name))
      .attr('d', arc)
      .on('mouseover', (event, v) => {
        const currentPath = d3.select(ref.current);
        // Set other arcs to lower opacity
        currentPath
          .selectAll('path')
          .filter((d) => d !== v)
          .transition()
          .duration(duration)
          .style('opacity', 0.2)
          .attr('transform', 'translate(0, 0)')
          .attr('stroke', 'white')
          .attr('stroke-width', 1);

        d3.select(event.currentTarget)
          .transition()
          .duration(duration)
          .attr('transform', calcTranslate(v))
          .attr('stroke', 'rgba(100, 100, 100, 0.2)')
          .attr('stroke-width', 2)
          .style('opacity', 1);
        // d3.select(event.currentTarget)
        //   .select('path')
        //   .transition()
        //   .duration(duration)
        //   .attr('stroke', 'rgba(100, 100, 100, 0.2)')
        //   .attr('stroke-width', 2);
        // d3.select('.card-back text').text(v.data.type);

        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`<div>${v.data.name}: ${v.data.value.toLocaleString()}</div>`)
          .style('background-color', colorScale(v.data.name)) // Set the background color to match the task color
          .style('color', '#fff') // Change the text color to white for better readability
          .style('left', `${event.pageX + 8}px`)
          .style('top', `${event.pageY - 30}px`);
      })
      .on('mouseout', (event) => {
        const currentPath = d3.select(ref.current);
        currentPath.selectAll('path').transition().duration(duration).style('opacity', 1);
        d3.select(event.currentTarget)
          .transition()
          .duration(duration)
          .attr('transform', 'translate(0, 0)')
          .attr('stroke', 'white')
          .attr('stroke-width', 1);
        // d3.select(event.currentTarget)
        //   .select('path')
        //   .transition()
        //   .duration(duration)
        //   .attr('stroke', 'white')
        //   .attr('stroke-width', 1);

        // d3.selectAll('path').transition().duration(duration).style('opacity', 1);

        tooltip.transition().duration(500).style('opacity', 0);
      });

    // (add title to the arcs) removed as tooltip is added
    // arcs.append('title').text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(pie(data))
      .join('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text((d) => d.data.value.toLocaleString('en-US'))
      );

    // add the legend beside the chart
    const legend = svg
      .append('g')
      .attr('transform', (_d, i) => 'translate(' + (width - 350) + ',' + (i * 15 - 100) + ')');

    legend
      .selectAll(null)
      .data(pie(data))
      .enter()
      .append('rect')
      .attr('class', 'legend')
      .attr('y', (_d, i) => i * 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => colorScale(d.data.name));

    legend
      .selectAll(null)
      .data(pie(data))
      .enter()
      .append('text')
      .attr('font-size', 12)
      .attr('x', 15)
      .attr('y', (_d, i) => i * 20 + 9)
      .text((d) => `${d.data.name} (${d.data.value.toLocaleString('en-US')})`);

    // Cleanup function to remove SVG elements when component unmounts
    return () => {
      svg.selectAll('*').remove();
      tooltip.remove();
    };
  }, [data, width, height]); // Dependencies in the array ensure the effect runs when data or width changes

  return <svg ref={ref}></svg>;
};

export default PieChart;
