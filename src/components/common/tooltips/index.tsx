import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return '';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full';
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full';
      case 'left':
        return 'right-0 top-1/2 transform -translate-y-1/2 translate-x-full';
      case 'right':
        return 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full';
      default:
        return '';
    }
  };

  return (
    <div
      className='relative flex items-center'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 p-2 w-max max-w-xs text-sm text-white bg-gray-600 rounded-lg shadow-lg ${getPositionClasses()}`}
        >
          <div className='relative'>
            {text}
            <div
              className={`absolute w-3 h-3 bg-gray-600 transform rotate-45 ${getArrowClasses()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { Tooltip };
