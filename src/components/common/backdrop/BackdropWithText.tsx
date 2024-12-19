import { SpinnerWithText } from '@/components/common/spinner';
import { FC, useState, useEffect } from 'react';

interface BackdropWithTextProps {
  text?: string;
  className?: string;
  isVisible?: boolean;
}
const BackdropWithText: FC<BackdropWithTextProps> = ({
  text = 'Loading data ...',
  className,
  isVisible = true,
}) => {
  const [isShow, setIsShow] = useState<boolean>(isVisible);
  useEffect(() => {
    setIsShow(isVisible);
  }, [isVisible]);

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-magpie-light-75 font-medium text-indigo-500 transition-opacity duration-200 ease-in-out ${className} ${isShow ? 'bg-opacity-80' : 'bg-opacity-0'}`}
    >
      <SpinnerWithText text={text} />
    </div>
  );
};

export default BackdropWithText;
