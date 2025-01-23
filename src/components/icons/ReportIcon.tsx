import { SVGProps } from 'react';

export const ReportIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} {...props}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v16h16V8l-4-4H4z' />
    <path strokeLinecap='round' strokeLinejoin='round' d='M16 8V4' />
    <path strokeLinecap='round' strokeLinejoin='round' d='M8 12h8M8 16h8' />
  </svg>
);
