import { classNames } from '@/utils/commonUtils';
import React from 'react';

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

const Select: React.FC<SelectProps> = ({ value, onChange, options, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={classNames(
        'w-30 appearance-none rounded-lg px-3 py-2 text-sm',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'text-gray-900 dark:text-gray-100',
        'focus:border-blue-500 dark:focus:border-blue-400',
        'focus:ring-1 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-400',
        'transition-colors duration-200',
        className // Allow additional class names to be passed
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
