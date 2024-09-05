import Spinner from './Spinner';
import { FC } from 'react';

export interface Props {
  text?: string;
}

const SpinnerWithText: FC<Props> = ({ text }) => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Spinner />
      {text && <div style={{ paddingTop: '1rem' }}>{text}</div>}
    </div>
  );
};

export default SpinnerWithText;
