import { FC, ReactNode, MouseEventHandler } from 'react';
import { Tooltip } from '@/components/common/tooltips';

export interface IconButtonProps {
  icon: ReactNode;
  tooltip?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'primary' | 'secondary' | 'light' | 'green' | 'red' | 'yellow' | 'gray';
  disabled?: boolean;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipBackground?: 'gray' | 'white';
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  disabled = false,
  className = '',
  tooltipPosition = 'top',
  tooltipBackground = 'white',
}) => {
  const baseIconButtonStyles =
    'p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100';

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseIconButtonStyles} ${className}`}
    >
      {icon}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip text={tooltip} position={tooltipPosition} background={tooltipBackground}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default IconButton;
