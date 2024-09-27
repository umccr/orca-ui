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
    selectItemLabel !== selectedItemLabel && setSelectItemLabel(selectedItemLabel);
  }, [selectItemLabel, selectedItemLabel]);

  const baseClassName =
    'inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out';

  return (
    <ul className='flex flex-wrap px-2 py-1'>
      {buttonItems &&
        buttonItems.map((item, index) => (
          <li className='m-1' key={index}>
            <button
              className={classNames(
                baseClassName,
                selectItemLabel?.toUpperCase() == item.label.toUpperCase()
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white'
              )}
              onClick={item.onClick}
            >
              {item.label}
              {item.subLabel && (
                <span
                  className={classNames(
                    'ml-2',
                    selectItemLabel?.toUpperCase() === item.label.toUpperCase()
                      ? 'text-indigo-200'
                      : 'text-slate-400 dark:text-slate-500'
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
