import React from 'react';
import { Badge } from '@/components/common/badges';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Dropdown } from '@/components/common/dropdowns';
import { Tooltip } from '@/components/common/tooltips';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface InputBadgeBoxType {
  operator: 'and' | 'or';
  inputState: string[];
  inputDraft: string;
}

interface InputBadgeBoxProps {
  label: string;
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
      <div className='flex w-28 flex-row text-sm'>
        {label}
        {tooltipText && (
          <Tooltip text={tooltipText} position='right' background='light' size='large'>
            <InformationCircleIcon className='2-5 mx-2 h-5' />
          </Tooltip>
        )}
      </div>
      <div className='flex w-full flex-wrap rounded-lg border px-1 py-1'>
        {inputState.map((key, index) => (
          <Badge className='mx-1 my-1' key={`key-filter-${index}`} type={badgeType(key)}>
            {key}
            <div
              className='ml-2 inline cursor-pointer'
              onClick={() => {
                setInput((prev) => ({
                  ...prev,
                  inputState: prev.inputState.filter((val) => val !== key),
                }));
              }}
            >
              <XMarkIcon aria-hidden='true' className='h-3 w-3' />
            </div>
          </Badge>
        ))}
        <span className='flex min-w-80 flex-grow flex-row'>
          <input
            className='min-w-60 flex-grow border-none px-2 py-2 text-sm focus-visible:outline-none'
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
            items={[
              {
                label: 'AND',
                onClick: () => setOperator('and'),
              },
              {
                label: 'OR',
                onClick: () => setOperator('or'),
              },
            ].filter((item) => allowedOperator.includes(item.label.toLowerCase() as 'and' | 'or'))}
          />
        </span>
      </div>
    </div>
  );
};

export default InputBadgeBox;
