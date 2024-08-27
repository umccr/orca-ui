import * as d3 from 'd3';
import { FC } from 'react';
interface PieChartProps {
  data: { name: string; value: number }[];
  width: number;
  height: number;
}
const PieChart: FC<PieChartProps> = ({ data, width, height }) => {
  const radius = height / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const arc = d3
    .arc<{ value: number }>()
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1);
  const pie = d3
    .pie<{ value: number }>()
    .padAngle(2 / radius)
    .sort(null)
    .value((d) => d.value);

  const arcs = pie(data);

  const viewBox = `-${width / 2 - 100} -${height / 2} ${width} ${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <g>
        {arcs.map((d, i) => (
          <g key={i} textAnchor={'middle'} fontSize={12}>
            <title>{data[i].name}</title>
            <path d={arc(d) as string} fill={color(i.toString())} className='' />
          </g>
        ))}
      </g>
      <g>
        {arcs.map((d, i) => (
          <g key={i} textAnchor={'middle'} fontSize={12}>
            <text transform={`translate(${arc.centroid(d)})`}>
              {/* {d.endAngle - d.startAngle > 0.25 && (
                <tspan y={'-0.4em'} fontWeight={'bold'}>
                  {data[i].name}
                </tspan>
              )} */}
              {d.endAngle - d.startAngle > 0.25 && (
                <tspan x={0} y={'0.7em'} fillOpacity={0.7}>
                  {data[i].value}
                </tspan>
              )}
            </text>
          </g>
        ))}
      </g>
      {data.map((d, i) => (
        <g key={i} transform={'translate(' + (width - 350) + ',' + (i * 15 - 100) + ')'}>
          <rect width={10} height={10} fill={color(i.toString())}></rect>
          <text x={15} y={10} fontSize={12}>
            {d.name}
          </text>
        </g>
      ))}
    </svg>
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <g>
        {arcs.map((d, i) => (
          <g key={i} textAnchor={'middle'} fontSize={12}>
            <title>{data[i].name}</title>
            <path
              d={arc(d) as string}
              fill={color(i.toString())}
              className='border-red-800 border-4'
            />
          </g>
        ))}
      </g>
      <g>
        {arcs.map((d, i) => (
          <g key={i} textAnchor={'middle'} fontSize={12}>
            <text transform={`translate(${arc.centroid(d)})`}>
              <tspan y={'-0.4em'} fontWeight={'bold'}>
                {data[i].name}
              </tspan>
              {d.endAngle - d.startAngle > 0.25 ? (
                <tspan x={0} y={'0.7em'} fillOpacity={0.7}>
                  {data[i].value}
                </tspan>
              ) : (
                ''
              )}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default PieChart;
