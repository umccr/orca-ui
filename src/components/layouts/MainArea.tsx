import { FC, PropsWithChildren } from 'react';
const MainArea: FC<PropsWithChildren> = ({ children }) => {
  return <main className='w-full h-full '>{children}</main>;
};

export default MainArea;
