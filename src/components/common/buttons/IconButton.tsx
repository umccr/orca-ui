import { FC, ReactNode, MouseEventHandler } from 'react';
import { Tooltip } from '@/components/common/tooltips';

export interface IconButtonProps {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'primary' | 'secondary' | 'light' | 'green' | 'red' | 'yellow' | 'gray';
  disabled?: boolean;
  className?: string;
  hasTooltip?: boolean;
  tooltipText?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  tooltipBackground?: 'light' | 'dark';
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  hasTooltip = false,
  tooltipText,
  onClick,
  disabled = false,
  className = '',
  tooltipPosition = 'top',
  tooltipBackground = 'dark',
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

  if (hasTooltip) {
    return (
      <Tooltip text={tooltipText} position={tooltipPosition} background={tooltipBackground}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default IconButton;
