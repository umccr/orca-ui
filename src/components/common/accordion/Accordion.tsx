import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  chevronPosition?: 'left' | 'right';
  className?: string;
}

const Accordion = ({
  title,
  children,
  defaultOpen = true,
  chevronPosition = 'left',
  className,
}: AccordionProps) => {
  return (
    <Disclosure as='div' defaultOpen={defaultOpen} className={className}>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <DisclosureButton className='group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700'>
          {chevronPosition === 'left' && (
            <ChevronRightIcon
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform group-data-[open]:rotate-90 dark:text-gray-400`}
            />
          )}

          {title}

          {chevronPosition === 'right' && (
            <ChevronRightIcon
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform group-data-[open]:rotate-90 dark:text-gray-400`}
            />
          )}
        </DisclosureButton>

        <DisclosurePanel className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400' transition>
          <div className='origin-top transition duration-200 ease-out data-[closed]:-translate-y-2 data-[closed]:opacity-0'>
            {children}
          </div>
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
};

export default Accordion;
