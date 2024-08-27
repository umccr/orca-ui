import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Task {
  startDate: Date;
  endDate: Date;
  taskName: string;
}

interface GanttChartProps {
  tasks: Task[];
  width: number;
  height: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, width, height }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!tasks.length) return;

    const svgWidth = width;
    const svgHeight = height;
    const margin = { top: 20, right: 40, bottom: 20, left: 60 };
    const effectiveWidth = svgWidth - margin.left - margin.right;
    const effectiveHeight = svgHeight - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain([d3.min(tasks, (task) => task.startDate)!, d3.max(tasks, (task) => task.endDate)!])
      .range([0, effectiveWidth]);

    const yScale = d3
      .scaleBand()
      .domain(tasks.map((task) => task.taskName))
      .range([0, effectiveHeight])
      .padding(0.1);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(tasks.map((task) => task.taskName))
      .range(d3.schemeTableau10); // This is a built-in D3 color scheme

    const svg = d3
      .select(ref.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

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

    svg
      .selectAll('rect')
      .data(tasks)
      .enter()
      .append('rect')
      .attr('x', (task) => xScale(task.startDate))
      .attr('y', (task) => yScale(task.taskName)!)
      .attr('width', (task) => xScale(task.endDate) - xScale(task.startDate))
      .attr('height', yScale.bandwidth())
      .attr('fill', (task) => colorScale(task.taskName))
      .on('mouseover', (event, task) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip
          .html(
            `${task.taskName}: ${task.startDate.toISOString()} to ${task.endDate.toISOString()}`
          )
          .style('background-color', colorScale(task.taskName)) // Set the background color to match the task color
          .style('color', '#fff') // Change the text color to white for better readability
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').attr('transform', `translate(0,${effectiveHeight})`).call(xAxis);

    svg.append('g').call(yAxis);

    return () => {
      //   d3.select(ref.current).selectAll('*').remove(); // Clean up SVG elements
      svg.selectAll('*').remove();
    };
  }, [tasks, width, height]); // Rerun effect if tasks or dimensions change

  return <svg ref={ref} />;
};

export default GanttChart;
