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
  badgeType: (value: string) => 'primary' | 'secondary' | 'warning' | 'unknown';
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
    <div className='flex flex-row items-center mt-2'>
      <div className='w-28 text-sm flex flex-row'>
        {label}
        {tooltipText && (
          <Tooltip text={tooltipText} position='right' background='white'>
            <InformationCircleIcon className='mx-2 h-5 2-5' />
          </Tooltip>
        )}
      </div>
      <div className='rounded-lg w-full border py-1 px-1 flex flex-wrap'>
        {inputState.map((key, index) => (
          <Badge className='mx-1 my-1' key={`key-filter-${index}`} type={badgeType(key)}>
            {key}
            <div className='pl-2 '>
              <XMarkIcon />
            </div>
            <div
              className='inline cursor-pointer'
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
        <input
          className='flex-grow min-w-60 text-sm px-2 py-2 focus-visible:outline-none border-none'
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
      </div>
    </div>
  );
};

export default InputBadgeBox;
