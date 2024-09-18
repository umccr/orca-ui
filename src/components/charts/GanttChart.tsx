import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { dayjs } from '@/utils/dayjs';

interface Task {
  startDate: Date;
  endDate: Date;
  taskName: string;
  libraryIds: string[];
  endStatus: string;
  subjectId: string;
}

interface TaskType {
  [key: string]: Task[];
}

interface GanttChartProps {
  tasks: TaskType;
  width: number;
  height: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, width, height }) => {
  const ref = useRef<SVGSVGElement>(null);
  const taskHeight = 5;

  useEffect(() => {
    const taskEntries = Object.entries(tasks);
    if (!taskEntries.length) return;

    const svgWidth = width;
    const svgHeight = height;
    const margin = { top: 20, right: 40, bottom: 20, left: 200 };
    const effectiveWidth = svgWidth - margin.left - margin.right;
    // const effectiveHeight = svgHeight - margin.top - margin.bottom;

    // Flatten the tasks array to get a list of all tasks with their types
    const allTasks = taskEntries.flatMap(([taskType, taskArray]) =>
      taskArray.map((task) => ({
        ...task,
        taskType,
      }))
    );

    // Calculate the total height needed for each group
    const groupHeights = taskEntries.map(([taskType, taskArray]) => ({
      taskType,
      height: taskArray.length * taskHeight, // Set each task's height
    }));

    const totalHeight = d3.sum(groupHeights, (d) => d.height) + (groupHeights.length - 1) * 10; // Add 10px margin between groups

    // Update effectiveHeight based on calculated totalHeight
    const effectiveHeight = totalHeight > svgHeight ? totalHeight : svgHeight;

    const yScale = d3.scaleBand().range([0, effectiveHeight]).padding(0);

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(allTasks, (task) => task.startDate)!,
        d3.max(allTasks, (task) => task.endDate)!,
      ])
      .range([0, effectiveWidth]);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(allTasks.map((task) => task.taskName))
      .range(d3.schemeTableau10); // This is a built-in D3 color scheme

    const svg = d3
      .select(ref.current)
      .attr('width', svgWidth)
      .attr('height', effectiveHeight + margin.top + margin.bottom) // Adjust height based on totalHeight
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

    // Render task bars
    let currentYPosition = 0;
    taskEntries.forEach(([taskType, taskArray], index) => {
      const groupHeight = taskArray.length * taskHeight;
      const groupMidpoint = currentYPosition + groupHeight / 2;

      svg
        .selectAll(`rect.${taskType}`)
        .data(taskArray)
        .enter()
        .append('rect')
        .attr('class', 'workflows')
        .attr('class', taskType)
        .attr('x', (task) => xScale(task.startDate))
        .attr('y', (_task, i) => currentYPosition + i * taskHeight)
        .attr('width', (task) => xScale(task.endDate) - xScale(task.startDate))
        .attr('height', taskHeight)
        .attr('fill', (task) => colorScale(task.subjectId))
        .on('mouseover', (event, task) => {
          const currentSvg = d3.select(ref.current);

          currentSvg
            .selectAll(`rect`)
            // @ts-expect-error: d type is dynamic based on the data
            .filter((d) => d.subjectId !== task.subjectId)
            .transition()
            .duration(200)
            .style('opacity', 0.2);

          // Enlarge the bar and add a stroke on hover
          currentSvg
            .selectAll(`rect`)
            // @ts-expect-error: d type is dynamic based on the data
            .filter((d) => d.subjectId === task.subjectId)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .attr('height', taskHeight + 6);
          // .attr('stroke', colorScale(task.subjectId))
          // .attr('stroke-width', 10);

          tooltip.transition().duration(200).style('opacity', 1);
          tooltip
            .html(
              // `portalRunId: ${task.taskName}<br>
              //  subjectId: ${task.subjectId}<br>
              //  library: [${task.libraryIds.join(', ')}]<br>
              //  start: ${task.startDate.toISOString()}<br>
              //  end: ${task.endDate.toISOString()}`
              `subjectId: ${task.subjectId}<br>
               start: ${dayjs(task.startDate).format('MMMM D, YYYY h:mm A')}<br>
               end: ${dayjs(task.endDate).format('MMMM D, YYYY h:mm A')}`
            )
            .style('background-color', colorScale(task.subjectId)) // Set the background color to match the task color
            .style('color', '#fff') // Change the text color to white for better readability
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 70}px`);
        })
        .on('mouseout', (_event, task) => {
          const currentSvg = d3.select(ref.current);

          // remove the hover effect
          currentSvg
            .selectAll(`rect`)
            // @ts-expect-error: d type is dynamic based on the data
            .filter((d) => d.subjectId === task.subjectId)
            .transition()
            .duration(200)
            // .attr('fill', colorScale(task.subjectId))
            .attr('stroke', 'none')
            .attr('height', taskHeight);

          currentSvg
            .selectAll(`rect`)
            // @ts-expect-error: d type is dynamic based on the data
            .filter((d) => d.subjectId !== task.subjectId)
            .transition()
            .duration(200)
            .style('opacity', 1);

          // Hide the tooltip
          tooltip.transition().duration(200).style('opacity', 0);
        });

      // Render group label
      svg
        .append('text')
        .attr('x', -10)
        .attr('y', groupMidpoint)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(taskType);

      // Add a dividing line between groups
      if (index < taskEntries.length - 1) {
        svg
          .append('line')
          .attr('x1', 0)
          .attr('x2', effectiveWidth)
          .attr('y1', currentYPosition + groupHeight + 5) // 5px before the next group
          .attr('y2', currentYPosition + groupHeight + 5)
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,2');
      }

      // Update the current Y position for the next group
      currentYPosition += groupHeight + 10; // Add 10px margin between groups
    });

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').attr('transform', `translate(0,${effectiveHeight})`).call(xAxis);
    svg.append('g').call(yAxis);

    return () => {
      //   d3.select(ref.current).selectAll('*').remove(); // Clean up SVG elements
      svg.selectAll('*').remove();
      tooltip.remove(); // Clean up tooltip
    };
  }, [tasks, width, height]); // Rerun effect if tasks or dimensions change

  return <svg ref={ref} />;
};

export default GanttChart;
