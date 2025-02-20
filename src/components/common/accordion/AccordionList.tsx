import { FC, FunctionComponent, ReactNode, SVGProps } from 'react';
import Accordion from './Accordion';
import { classNames } from '@/utils/commonUtils';
import { RedirectIcon } from '@/components/icons/RedirectIcon';
interface AccordionListItem {
  key: string;
  keyIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  value: ReactNode;
  isLink?: boolean;
}

interface AccordionListProps {
  title: ReactNode;
  data: AccordionListItem[];
  defaultOpen?: boolean;
  chevronPosition?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
}

const AccordionList: FC<AccordionListProps> = ({
  title,
  data,
  defaultOpen = true,
  chevronPosition = 'right',
  className,
  buttonClassName,
}) => {
  return (
    <Accordion
      title={title}
      defaultOpen={defaultOpen}
      chevronPosition={chevronPosition}
      className={classNames(
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-700',
        'overflow-hidden rounded-lg',
        'hover:shadow-sm dark:hover:shadow-gray-800',
        'shadow-sm dark:shadow-gray-800',
        className
      )}
      buttonClassName={buttonClassName}
    >
      <div className='space-y-1 py-1'>
        {data.map((item: AccordionListItem, index: number) => (
          <div
            key={index}
            className={classNames(
              'group transition-colors duration-150 ease-in-out',
              'rounded-md px-2 py-1 sm:px-4',
              item.isLink && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
            )}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {item.keyIcon && (
                  <div className='flex-shrink-0'>
                    <item.keyIcon
                      className={classNames(
                        'h-4 w-4',
                        'text-gray-400 dark:text-gray-500',
                        'group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      )}
                    />
                  </div>
                )}
                <span
                  className={classNames(
                    'text-sm font-medium',
                    'text-gray-500 dark:text-gray-400',
                    'group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  )}
                >
                  {item.key}
                </span>
              </div>
              {item.isLink && (
                <RedirectIcon
                  className={classNames(
                    'h-4 w-4',
                    'text-gray-400 dark:text-gray-600',
                    'group-hover:text-gray-500 dark:group-hover:text-gray-400',
                    'transition-transform duration-150 ease-in-out',
                    'group-hover:translate-x-0.5'
                  )}
                />
              )}
            </div>
            <div
              className={classNames(
                'mt-1',
                'text-sm',
                item.value
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'italic text-gray-500 dark:text-gray-400'
              )}
            >
              {item.value || 'None'}
            </div>
          </div>
        ))}
      </div>
    </Accordion>
  );
};

export default AccordionList;
