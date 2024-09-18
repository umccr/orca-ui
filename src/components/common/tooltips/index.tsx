import { ReactNode, useState, FC } from 'react';
import { Transition } from '@headlessui/react';
import { classNames } from '@/utils/commonUtils';

interface TooltipProps {
  text: string | ReactNode;
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right';
  size?: 'small' | 'medium' | 'large';
  background?: 'gray' | 'white';
  children: ReactNode;
}

const Tooltip: FC<TooltipProps> = ({
  text,
  position = 'top',
  size = 'medium',
  background = 'gray',
  children,
}) => {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs p-2';
      case 'large':
        return 'text-base p-2';
      default:
        return 'text-sm p-2'; // medium by default
    }
  };

  const getBackgroundClasses = () => {
    return background === 'white' ? 'bg-white text-gray-500' : 'bg-gray-600 text-white';
  };

  return (
    <div
      className='relative flex items-center'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <Transition show={isVisible}>
        <div
          className={classNames(
            // Base styles
            'absolute z-10 w-max max-w-xs rounded-lg shadow-lg border transition ease-in-out',
            // Shared closed styles
            'data-[closed]:opacity-0',
            // Entering styles
            'data-[enter]:duration-200 ',
            // Leaving styles
            'data-[leave]:duration-200 ',
            // Position classes
            ` ${getSizeClasses()} ${getBackgroundClasses()} ${getPositionClasses()}`
          )}
        >
          <div className='relative'>
            {text}
            <div
              className={`absolute w-3 h-3 transform rotate-45 ${getBackgroundClasses()} ${getArrowClasses()}`}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
};

export { Tooltip };
