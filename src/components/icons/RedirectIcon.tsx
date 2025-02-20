import { SVGProps } from 'react';

export const RedirectIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
      />
    </svg>
  );
};
