import { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: { name: string; value: number }[];
  width: number;
  height?: number;
}

const BarChart: FC<BarChartProps> = ({ data, width, height = 240 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate max label length to determine bottom margin
    // const maxLabelLength = Math.max(...data.map((d) => d.name.length));
    // const bottomMargin = Math.max(80, maxLabelLength * 4); // Adjust multiplier as needed

    // Calculate legend width based on longest text
    const legendWidth = Math.max(...data.map((d) => d.name.length)) * 8 + 40; // Approximate width needed

    // Set margins with dynamic bottom margin
    const margin = {
      top: 20,
      right: legendWidth + 20, // Add space for legend
      bottom: Math.max(80, Math.max(...data.map((d) => d.name.length)) * 4),
      left: 60,
    };

    // Calculate dimensions
    const containerWidth = Math.min(800, width); // Increased to accommodate legend
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.name))
      .range([
        '#60A5FA', // blue-400
        '#34D399', // green-400
        '#F87171', // red-400
        '#FBBF24', // yellow-400
        '#A78BFA', // purple-400
        '#F472B6', // pink-400
        '#2DD4BF', // teal-400
        '#FB923C', // orange-400
      ]);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    // Create chart group and transform it
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name) || 0)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => innerHeight - y(d.value))
      .attr('fill', (d) => colorScale(d.name)) // Use color scale
      .attr('rx', 4) // Rounded corners
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', d3.color(colorScale(d.name))?.darker().toString() || ''); // Darker version of the same color

        // Add tooltip
        tooltip
          .style('opacity', 1)
          .html(`${d.name}: ${d.value}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .style('background-color', colorScale(d.name))
          .style('color', 'white');
      })
      .on('mouseout', function (_event, d) {
        d3.select(this).transition().duration(200).attr('fill', colorScale(d.name));

        tooltip.style('opacity', 0);
      });

    // Modify X axis to better handle long labels
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('font-size', '12px') // Adjust font size if needed
      .call(function (text) {
        text.each(function () {
          const label = d3.select(this);
          const words = label.text().split(/(?=[A-Z])/); // Split on capital letters
          label.text(words.join(' ')); // Add spaces between words
        });
      });

    // Add Y axis
    g.append('g').call(d3.axisLeft(y));

    // Add tooltip div
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');

    // Add legend
    const legendSpacing = 20;
    const legendRectSize = 12;
    const legend = g
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth + 10}, 0)`);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * legendSpacing})`);

    // Add colored rectangles to legend
    legendItems
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .attr('rx', 2)
      .style('fill', (d) => colorScale(d.name));

    // Add text to legend with value
    legendItems
      .append('text')
      .attr('x', legendRectSize + 5)
      .attr('y', legendRectSize - 2)
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')
      .text((d) => `${d.name} (${d.value})`);

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return (
    <div className='relative'>
      <svg ref={svgRef} />
    </div>
  );
};

export default BarChart;
