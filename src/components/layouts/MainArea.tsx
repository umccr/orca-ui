import { PropsWithChildren } from 'react';
const MainArea = ({ children }: PropsWithChildren) => {
  return <main className='w-full h-full px-4 py-6 sm:px-6 lg:px-8 lg:py-6'>{children}</main>;
};

export default MainArea;
