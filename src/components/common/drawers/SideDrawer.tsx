import { FC, ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';
type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  dialogPanelClassName?: string;
  contentClassName?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
};
const sizeToWidth = {
  small: 'max-w-md',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
};

const SideDrawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  dialogPanelClassName,
  contentClassName,
  children,
  size = 'medium',
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-30'>
      {/* <DialogBackdrop
        transition
        className='fixed inset-0 bg-magpie-light-75 bg-opacity-75 data-[closed]:opacity-0' //transition-opacity duration-200 ease-in-out
      /> */}
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity duration-300 dark:bg-gray-900/80'
      />

      <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
        <DialogPanel
          transition
          className={classNames(
            'pointer-events-auto w-screen transform shadow-2xl transition-all duration-300 ease-in-out data-[closed]:translate-x-full',
            'border-l border-gray-200 dark:border-gray-800',
            sizeToWidth[size],
            dialogPanelClassName
          )}
        >
          <div className='flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900'>
            {/* Header */}
            <div className='bg-gray-50 px-4 py-6 sm:px-6 dark:bg-gray-800/50'>
              <div className='flex items-start justify-between space-x-3'>
                <div className='space-y-1'>
                  <DialogTitle className='text-lg font-semibold leading-6 text-gray-900 dark:text-white'>
                    {title}
                  </DialogTitle>
                  {subtitle && (
                    <p className='text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>
                  )}
                </div>
                <div className='flex h-7 items-center'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='relative rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                  >
                    <span className='absolute -inset-2.5' />
                    <span className='sr-only'>Close panel</span>
                    <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='relative flex-1 overflow-y-auto'>
              <div
                className={classNames(
                  'bg-white px-4 py-6 sm:px-6 dark:bg-gray-900',
                  contentClassName
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SideDrawer;
