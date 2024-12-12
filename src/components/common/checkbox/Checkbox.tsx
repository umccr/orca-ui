import { Checkbox as CheckboxComponent, Field, Label } from '@headlessui/react';
import { useState, FC, useEffect } from 'react';
import { classNames } from '@/utils/commonUtils';

interface CheckboxProps {
  className: string;
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
        className='group p-[1px] size-4 rounded border bg-gray-100 border-gray-300 cursor-pointer data-[checked]:bg-blue-600 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:cursor-not-allowed'
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
          'py-2 text-sm font-normal rounded',
          disabled ? 'text-gray-500 cursor-not-allowed ' : 'text-gray-900 cursor-pointer '
        )}
      >
        {label}
      </Label>
    </Field>
  );
};

export default Checkbox;
