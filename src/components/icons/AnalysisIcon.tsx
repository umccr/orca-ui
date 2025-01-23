import { SVGProps } from 'react';

export const AnalysisIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} {...props}>
    {/* Graph Background */}
    <path d='M4 4v16h16' strokeLinecap='round' strokeLinejoin='round' />

    {/* DNA Analysis Peaks */}
    <path
      d='M4 16l2-8 3 4 2-6 3 8 2-4 4 2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />

    {/* Data Points */}
    <circle cx='6' cy='8' r='1' fill='currentColor' />
    <circle cx='9' cy='12' r='1' fill='currentColor' />
    <circle cx='11' cy='6' r='1' fill='currentColor' />
    <circle cx='14' cy='14' r='1' fill='currentColor' />
    <circle cx='16' cy='10' r='1' fill='currentColor' />
    <circle cx='20' cy='12' r='1' fill='currentColor' />
  </svg>
);
