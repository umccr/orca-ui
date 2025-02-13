import { FC, useEffect, useState } from 'react';
import { classNames } from '@/utils/commonUtils';

interface ButtonItemProps {
  label: string;
  subLabel?: string;
  onClick: () => void;
}

interface ButtonGroupProps {
  buttonItems: ButtonItemProps[];
  selectedItemLabel: string | null;
}

const ButtonGroup: FC<ButtonGroupProps> = ({ buttonItems, selectedItemLabel }) => {
  const [selectItemLabel, setSelectItemLabel] = useState(selectedItemLabel);

  useEffect(() => {
    if (selectItemLabel !== selectedItemLabel) setSelectItemLabel(selectedItemLabel);
  }, [selectItemLabel, selectedItemLabel]);

  const baseClassName = classNames(
    'inline-flex items-center justify-center',
    'px-3.5 py-1.5',
    'text-sm font-medium leading-5',
    'rounded-full',
    'border border-slate-200 dark:border-slate-700',
    'bg-white dark:bg-slate-800',
    'text-slate-600 dark:text-slate-300', // Darker text for better contrast
    'transition-all duration-200 ease-in-out', // Smoother transition
    'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900', // Enhanced hover state
    'dark:hover:bg-slate-700 dark:hover:border-slate-600 dark:hover:text-white',
    'shadow-sm hover:shadow', // Enhanced shadow on hover
    'active:scale-95' // Subtle click animation
  );

  const selectedClassName = classNames(
    'bg-indigo-500 hover:bg-indigo-600', // Darker hover state
    'border-transparent', // Remove border when selected
    'text-white hover:text-white',
    'shadow-sm hover:shadow-md',
    'dark:bg-indigo-500 dark:hover:bg-indigo-600',
    'dark:border-transparent',
    'focus:ring-indigo-500' // Matching focus ring
  );

  return (
    <ul className='flex flex-wrap gap-2 px-2 py-1'>
      {buttonItems &&
        buttonItems.map((item, index) => (
          <li key={index}>
            <button
              className={classNames(
                baseClassName,
                selectItemLabel?.toUpperCase() === item.label.toUpperCase() ? selectedClassName : ''
              )}
              onClick={item.onClick}
            >
              <span>{item.label}</span>
              {item.subLabel && (
                <span
                  className={classNames(
                    'ml-2 text-sm',
                    selectItemLabel?.toUpperCase() === item.label.toUpperCase()
                      ? 'font-normal text-indigo-200'
                      : 'font-normal text-slate-400 dark:text-slate-500'
                  )}
                >
                  {item.subLabel}
                </span>
              )}
            </button>
          </li>
        ))}
    </ul>
  );
};

export default ButtonGroup;
