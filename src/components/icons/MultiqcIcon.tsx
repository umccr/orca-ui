import { SVGProps } from 'react';

export const MultiqcIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke='black'
    {...props}
  >
    <g fill='none' stroke='currentColor' strokeWidth='1.5'>
      {/* Top left quarter-circle with larger spacing */}
      <path d='M11,2 A9.5,9.5 0 0,0 2,11 H7.5 A4,4 0 0,1 11,7.5 V2 Z' />

      {/* Top right quarter-circle with larger spacing */}
      <path d='M13,2 A9.5,9.5 0 0,1 22,11 H16.5 A4,4 0 0,0 13,7.5 V2 Z' />

      {/* Bottom left quarter-circle with larger spacing */}
      <path d='M11,22 A9.5,9.5 0 0,1 2,13 H7.5 A4,4 0 0,0 11,16.5 V22 Z' />

      {/* Bottom right quarter-circle with larger spacing */}
      <path
        d='M13,22 A9.5,9.5 0 0,0 22,13 H16.5 A4,4 0 0,1 13,16.5 V22 Z'
        transform='rotate(90, 17, 18)'
      />
    </g>
  </svg>
);
