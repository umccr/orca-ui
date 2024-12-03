import { useEffect, useRef, FC } from 'react';
import * as d3 from 'd3';

interface DataItem {
  [key: string]: number | string | null;
}

interface ScatterplotMatrixProps {
  data: DataItem[];
  width: number;
  height: number;
}

const ScatterplotMatrix: FC<ScatterplotMatrixProps> = ({ data, width, height }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const padding = 28;
    const columns = Object.keys(data[0]).filter((key) => typeof data[0][key] === 'number');
    const size = (width - (columns.length + 1) * padding) / columns.length + padding;

    const x = columns.map((c) =>
      d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d[c] as number) as [number, number])
        .rangeRound([padding / 2, size - padding / 2])
    );

    const y = x.map((x) => x.copy().range([size - padding / 2, padding / 2]));

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.species as string))
      .range(d3.schemeCategory10);

    const axisx = d3
      .axisBottom<number>(d3.scaleLinear())
      .ticks(6)
      .tickSize(size * columns.length);

    const axisy = d3
      .axisLeft<number>(d3.scaleLinear())
      .ticks(6)
      .tickSize(-size * columns.length);

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `-${padding} 0 ${width} ${height}`);

    svg.append('style').text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    svg.append('g').call((g) =>
      g
        .selectAll('g')
        .data(x)
        .join('g')
        .attr('transform', (_d, i) => `translate(${i * size},0)`)
        .each(function (d) {
          d3.select(this as SVGGElement).call(axisx.scale(d));
        })
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'))
    );

    svg.append('g').call((g) =>
      g
        .selectAll('g')
        .data(y)
        .join('g')
        .attr('transform', (_d, i) => `translate(0,${i * size})`)
        .each(function (d) {
          d3.select(this as SVGGElement).call(axisy.scale(d));
        })
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'))
    );

    const cell = svg
      .append('g')
      .selectAll('g')
      .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
      .join('g')
      .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`);

    cell
      .append('rect')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('x', padding / 2 + 0.5)
      .attr('y', padding / 2 + 0.5)
      .attr('width', size - padding)
      .attr('height', size - padding);

    cell.each(function ([i, j]) {
      d3.select(this)
        .selectAll('circle')
        .data(
          data.filter((d) => !isNaN(d[columns[i]] as number) && !isNaN(d[columns[j]] as number))
        )
        .join('circle')
        .attr('cx', (d) => x[i](d[columns[i]] as number))
        .attr('cy', (d) => y[j](d[columns[j]] as number))
        .attr('r', 3.5)
        .attr('fill-opacity', 0.7)
        .attr('fill', (d) => color(d.species as string));
    });

    const circle = cell.selectAll('circle');

    // Add the brushing functionality
    brush(
      cell as d3.Selection<SVGGElement, [number, number], SVGGElement, [number, number]>,
      circle as unknown as d3.Selection<SVGCircleElement, DataItem, SVGGElement, DataItem>,
      { padding, size, x, y, columns }
    );

    svg
      .append('g')
      .style('font', 'bold 10px sans-serif')
      .style('pointer-events', 'none')
      .selectAll('text')
      .data(columns)
      .join('text')
      .attr('transform', (_d, i) => `translate(${i * size},${i * size})`)
      .attr('x', padding)
      .attr('y', padding)
      .attr('dy', '.71em')
      .text((d) => d);

    return () => {
      svg.selectAll('*').remove(); // Cleanup on component unmount
    };
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default ScatterplotMatrix;

// Brush function to be integrated
function brush(
  cell: d3.Selection<SVGGElement, [number, number], SVGGElement, unknown>,
  circle: d3.Selection<SVGCircleElement, DataItem, SVGGElement, unknown>,

  {
    padding,
    size,
    x,
    y,
    columns,
  }: {
    padding: number;
    size: number;
    x: d3.ScaleLinear<number, number, never>[];
    y: d3.ScaleLinear<number, number, never>[];
    columns: string[];
  }
) {
  const brush = d3
    .brush()
    .extent([
      [padding / 2, padding / 2],
      [size - padding / 2, size - padding / 2],
    ])
    .on('start', brushstarted)
    .on('brush', function (event) {
      brushed(event, d3.select<SVGGElement, [number, number]>(this).datum());
    })
    .on('end', brushended);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cell.call(brush as any, circle as d3.Selection<SVGCircleElement, DataItem, SVGGElement, unknown>);

  let brushCell: SVGGElement | null = null;

  function brushstarted(this: SVGGElement) {
    if (brushCell !== this) {
      d3.select(brushCell as SVGGElement).call(brush.move, null);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      brushCell = this;
    }
  }

  function brushed(event: d3.D3BrushEvent<DataItem>, [i, j]: [number, number]) {
    const selection = event.selection as [[number, number], [number, number]];
    if (selection) {
      const [[x0, y0], [x1, y1]] = selection;
      circle
        .attr(
          'r',
          (d) =>
            x0 > x[i](d[columns[i]] as number) ||
            x1 < x[i](d[columns[i]] as number) ||
            y0 > y[j](d[columns[j]] as number) ||
            y1 < y[j](d[columns[j]] as number)
              ? 1.5 // Make non-selected circles smaller
              : 3.5 // Highlight selected circles
        )
        .attr(
          'fill-opacity',
          (d) =>
            x0 > x[i](d[columns[i]] as number) ||
            x1 < x[i](d[columns[i]] as number) ||
            y0 > y[j](d[columns[j]] as number) ||
            y1 < y[j](d[columns[j]] as number)
              ? 0.3 // Dim non-selected circles
              : 1.0 // Brighten selected circles
        );
    }
  }

  function brushended({ selection }: { selection: [[number, number], [number, number]] | null }) {
    if (!selection) {
      circle.attr('r', 3.5).attr('fill-opacity', 0.7); // Reset all circles
    }
  }
}
