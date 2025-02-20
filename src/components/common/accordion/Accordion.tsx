import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { ReactNode, FC } from 'react';
import { classNames } from '@/utils/commonUtils';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  chevronPosition?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
}

const Accordion: FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = true,
  chevronPosition = 'left',
  className,
  buttonClassName,
}) => {
  return (
    <Disclosure
      as='div'
      defaultOpen={defaultOpen}
      className={classNames(
        'overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900',
        'transition duration-200 ease-in-out',
        className
      )}
    >
      <DisclosureButton
        className={classNames(
          'group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400',
          buttonClassName
        )}
      >
        {chevronPosition === 'left' && (
          <ChevronUpIcon
            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform group-data-[open]:rotate-180 dark:text-gray-400`}
          />
        )}

        {title}

        {chevronPosition === 'right' && (
          <ChevronUpIcon
            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform group-data-[open]:rotate-180 dark:text-gray-400`}
          />
        )}
      </DisclosureButton>

      <DisclosurePanel className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400' transition>
        <div className='origin-top transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0'>
          {children}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Accordion;
