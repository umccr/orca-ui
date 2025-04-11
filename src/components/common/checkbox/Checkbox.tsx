import { Checkbox as CheckboxComponent, Field, Label } from '@headlessui/react';
import { useState, FC, useEffect } from 'react';
import { classNames } from '@/utils/commonUtils';

interface CheckboxProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox: FC<CheckboxProps> = ({
  className,
  checked,
  onChange,
  disabled,
  label,
  description,
  size = 'md',
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const sizeStyles = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-5',
  };

  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const checkbox = (
    <CheckboxComponent
      as='button'
      checked={isChecked}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        'group shrink-0',
        sizeStyles[size],
        'rounded-sm',
        'border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-700',
        'data-checked:bg-blue-600 dark:data-checked:bg-blue-500',
        'data-disabled:cursor-not-allowed data-disabled:bg-gray-100 dark:data-disabled:bg-gray-800',
        'data-disabled:text-gray-400 dark:data-disabled:text-gray-500',
        'transition-colors duration-200',
        className
      )}
    >
      <svg
        className='stroke-white opacity-0 group-data-checked:opacity-100'
        viewBox='0 0 14 14'
        fill='none'
      >
        <path d='M3 8L6 11L11 3.5' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </CheckboxComponent>
  );

  if (!label) {
    return checkbox;
  }

  return (
    <Field className={classNames('flex items-center gap-3', disabled ? 'opacity-50' : '')}>
      {checkbox}
      <div className='flex min-w-0 flex-col justify-center'>
        <Label
          className={classNames(
            labelSizeStyles[size],
            'leading-none font-medium select-none',
            disabled
              ? ['cursor-not-allowed', 'text-gray-500 dark:text-gray-400']
              : ['cursor-pointer', 'text-gray-900 dark:text-gray-100']
          )}
        >
          {label}
        </Label>
        {description && (
          <p
            className={classNames(
              'mt-1',
              size === 'sm' ? 'text-xs' : 'text-sm',
              'text-gray-500 dark:text-gray-400'
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Field>
  );
};

export default Checkbox;
