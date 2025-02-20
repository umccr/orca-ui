import { Checkbox as CheckboxComponent, Field, Label } from '@headlessui/react';
import { useState, FC, useEffect } from 'react';
import { classNames } from '@/utils/commonUtils';

interface CheckboxProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

const Checkbox: FC<CheckboxProps> = ({ className, checked, onChange, disabled, label }) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Field className={classNames('flex items-center gap-2', className ? className : '')}>
      <CheckboxComponent
        as='button'
        checked={isChecked}
        onChange={onChange}
        disabled={disabled || false}
        className='group size-4 cursor-pointer rounded border border-gray-300 bg-gray-100 p-[1px] data-[disabled]:cursor-not-allowed data-[checked]:bg-blue-600 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400'
      >
        <svg
          className='stroke-white opacity-0 group-data-[checked]:opacity-100'
          viewBox='0 0 14 14'
          fill='none'
        >
          <path
            d='M3 8L6 11L11 3.5'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='inherit'
          />
        </svg>
      </CheckboxComponent>
      <Label
        className={classNames(
          'rounded py-2 text-sm font-normal',
          disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer text-gray-900'
        )}
      >
        {label}
      </Label>
    </Field>
  );
};

export default Checkbox;
