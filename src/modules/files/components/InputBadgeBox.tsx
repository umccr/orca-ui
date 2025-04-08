import React from 'react';
import { Badge } from '@/components/common/badges';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Dropdown } from '@/components/common/dropdowns';
import { Tooltip } from '@/components/common/tooltips';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';

export interface InputBadgeBoxType {
  operator: 'and' | 'or';
  inputState: string[];
  inputDraft: string;
}

interface InputBadgeBoxProps {
  label: string;
  labelClassName?: string;
  tooltipText?: string;
  inputState: string[];
  inputDraft: string;
  setInput: React.Dispatch<React.SetStateAction<InputBadgeBoxType>>;
  placeholder: string;
  badgeType: (value: string) => 'primary' | 'secondary' | 'warning' | 'success' | 'unknown';
  operator: 'and' | 'or';
  setOperator: (operator: 'and' | 'or') => void;
  allowedOperator: ('and' | 'or')[];
}

const InputBadgeBox: React.FC<InputBadgeBoxProps> = ({
  label,
  labelClassName,
  tooltipText,
  inputState,
  inputDraft,
  setInput,
  placeholder,
  badgeType,
  operator,
  setOperator,
  allowedOperator,
}) => {
  const handleAddInput = () => {
    if (inputDraft && !inputState.includes(inputDraft)) {
      setInput((prev) => ({
        ...prev,
        inputState: [...prev.inputState, inputDraft],
        inputDraft: '',
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        inputDraft: '',
      }));
    }
  };

  return (
    <div className='mt-2 flex flex-row items-center'>
      <div
        className={`flex w-28 flex-row items-center text-sm text-gray-700 dark:text-gray-300 ${labelClassName}`}
      >
        {label}
        {tooltipText && (
          <Tooltip
            text={tooltipText}
            position='right'
            background='light'
            size='small'
            className='z-50 w-96 text-wrap whitespace-normal'
          >
            <InformationCircleIcon className='ml-2 h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' />
          </Tooltip>
        )}
      </div>
      <div className='flex w-full flex-wrap rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex w-full flex-wrap items-center gap-1.5 px-3 py-1'>
          {inputState.map((key, index) => (
            <Badge
              className='group py-2 transition-all duration-200'
              key={`key-filter-${index}`}
              type={badgeType(key)}
            >
              {key}
              <div
                className='ml-2 inline cursor-pointer rounded-full p-0.5 transition-colors duration-200 group-hover:bg-black/5 dark:group-hover:bg-white/10'
                onClick={() => {
                  setInput((prev) => ({
                    ...prev,
                    inputState: prev.inputState.filter((val) => val !== key),
                  }));
                }}
              >
                <XMarkIcon
                  aria-hidden='true'
                  className='h-3 w-3 text-current opacity-60 transition-opacity duration-200 hover:opacity-100'
                />
              </div>
            </Badge>
          ))}
          <div className='flex flex-grow items-center gap-2'>
            <input
              className={classNames(
                'min-w-[200px] flex-grow rounded-md border-none px-2 py-2 text-sm',
                'bg-transparent text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus-visible:ring-0 focus-visible:outline-none',
                'transition-all duration-200'
              )}
              onBlur={handleAddInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddInput();
                }
              }}
              onChange={(e) => {
                setInput((prev) => ({
                  ...prev,
                  inputDraft: e.target.value.trim(),
                }));
              }}
              value={inputDraft}
              placeholder={placeholder}
            />
            <Dropdown
              value={operator.toUpperCase()}
              className='w-[100px]'
              menuButtonClassName={classNames(
                'h-10 rounded-md',
                'border border-gray-200 dark:border-gray-600',
                'bg-gray-50 dark:bg-gray-700',
                'text-sm font-medium',
                'text-gray-700 dark:text-gray-200',
                'hover:bg-gray-100 dark:hover:bg-gray-600'
              )}
              menuItemsClassName='w-[100px] -mr-1'
              items={[
                {
                  label: 'AND',
                  onClick: () => setOperator('and'),
                },
                {
                  label: 'OR',
                  onClick: () => setOperator('or'),
                },
              ].filter((item) =>
                allowedOperator.includes(item.label.toLowerCase() as 'and' | 'or')
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputBadgeBox;
