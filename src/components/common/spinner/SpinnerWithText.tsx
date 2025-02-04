import Spinner from './Spinner';
import { FC } from 'react';

export interface Props {
  text?: string;
  className?: string;
}

const SpinnerWithText: FC<Props> = ({ text, className }) => {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center ${className ?? ''}`}>
      <Spinner />
      {text && <div className='pt-4'>{text}</div>}
    </div>
  );
};

export default SpinnerWithText;
