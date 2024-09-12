import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataItem {
  [workflow: string]: number;
}

interface StackedBarChartProps {
  data: { [subjectId: string]: DataItem };
  width: number;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, width }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const subjects = Object.keys(data);
    const allWorkflowTypes = Array.from(
      new Set(subjects.flatMap((subjectId) => Object.keys(data[subjectId])))
    );
    console.log('allWorkflowTypes', allWorkflowTypes, 'subjects', subjects);
    const marginTop = 20;
    const marginRight = 10; // Increased to accommodate the legend on the right
    const marginBottom = 10; // Increased to accommodate the legend at the bottom
    const marginLeft = 100;
    const stackGap = 2; // Gap between each stack
    // const legendBoxSize = 10;
    const stackHeight = 10;

    // Sort subjects by the total count of all workflow types
    const sortedSubjects = subjects.sort((a, b) => {
      const totalA = allWorkflowTypes.reduce(
        (sum, workflowType) => sum + (data[a][workflowType] || 0),
        0
      );
      const totalB = allWorkflowTypes.reduce(
        (sum, workflowType) => sum + (data[b][workflowType] || 0),
        0
      );
      return totalB - totalA;
    });

    const height = sortedSubjects.length * stackHeight + marginTop + marginBottom;

    // Scales
    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(sortedSubjects, (subjectId) =>
          allWorkflowTypes.reduce(
            (sum, workflowType) => sum + (data[subjectId][workflowType] || 0),
            0
          )
        )!,
      ])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleBand<string>()
      .domain(sortedSubjects)
      .range([marginTop, height - marginBottom])
      .padding(0.08);

    const color = d3
      .scaleOrdinal<string>()
      .domain(allWorkflowTypes.map((workflowType) => workflowType))
      .range(d3.schemeTableau10)
      .unknown('#ccc');

    // Create the SVG container
    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    // Tooltip setup
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('font-size', '12px')
      .style('position', 'absolute')
      .style('padding', '5px')
      .style('border', '1px solid #ccc')
      .style('background-color', 'white')
      .style('pointer-events', 'none');

    // Iterate over each subject and create stacked bars
    sortedSubjects.forEach((subjectId) => {
      let cumulativeX = marginLeft;

      allWorkflowTypes.forEach((workflowType) => {
        const value = data[subjectId][workflowType] || 0;
        if (value > 0) {
          const barWidth = x(value) - marginLeft;

          svg
            .append('rect')
            .attr('x', cumulativeX)
            .attr('y', y(subjectId)!)
            .attr('height', y.bandwidth() - stackGap)
            .attr('width', barWidth)
            .attr('fill', color(workflowType))
            .attr('class', 'stack-rect')
            .on('mouseover', (event) => {
              d3.selectAll('.stack-rect').transition().duration(200).style('opacity', 0.2);

              d3.select(event.currentTarget).transition().duration(200).style('opacity', 1);

              tooltip.transition().duration(200).style('opacity', 0.9);
              tooltip
                .html(`${subjectId} <br> ${workflowType}: ${value}`)
                .style('background-color', color(workflowType)) // Set the background color to match the task color
                .style('color', '#fff')
                .style('left', `${event.pageX + 5}px`)
                .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', () => {
              d3.selectAll('.stack-rect').transition().duration(200).style('opacity', 1);

              tooltip.transition().duration(500).style('opacity', 0);
            });

          cumulativeX += barWidth;
        }
      });
    });

    // Append the horizontal axis
    svg
      .append('g')
      .attr('transform', `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(width / 100, 's'))
      .call((g) => g.selectAll('.domain').remove());

    // Append the vertical axis
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g) => g.selectAll('.domain').remove());

    // Legend
    // const legend = svg
    //   .append('g')
    //   .attr('transform', `translate(${width - marginRight - 250},${height - marginBottom - 200})`);

    // legend
    //   .selectAll('rect')
    //   .data(allWorkflowTypes)
    //   .enter()
    //   .append('rect')
    //   .attr('x', 0)
    //   .attr('y', (_d, i) => i * (legendBoxSize + 5))
    //   .attr('width', legendBoxSize)
    //   .attr('height', legendBoxSize)
    //   .attr('fill', color);

    // legend
    //   .selectAll('text')
    //   .data(allWorkflowTypes)
    //   .enter()
    //   .append('text')
    //   .attr('font-size', 12)
    //   .attr('x', legendBoxSize + 5)
    //   .attr('y', (_d, i) => i * (legendBoxSize + 5) + legendBoxSize / 2)
    //   .attr('dy', '0.35em')
    //   .text((d) => d);

    // Cleanup on unmount
    return () => {
      svg.selectAll('*').remove();
      tooltip.remove();
    };
  }, [data, width]);

  return <svg ref={ref}></svg>;
};

export default StackedBarChart;
