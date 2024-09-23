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
  // content: ReactNode;
  children: ReactNode;
};

const sideDrawer: FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  dialogPanelClassName,
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-magpie-light-75 bg-opacity-75 data-[closed]:opacity-0' //transition-opacity duration-200 ease-in-out
      />
      <div className='fixed inset-0' />

      <div className='fixed inset-0 overflow-scroll'>
        <div className='absolute inset-0 overflow-scroll'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
            <DialogPanel
              transition
              className={classNames(
                'pointer-events-auto w-screen max-w-2xl transform transition duration-200 ease-in-out data-[closed]:translate-x-full sm:duration-300',
                dialogPanelClassName ? dialogPanelClassName : ''
              )}
            >
              <div className='flex-1 overflow-y-scroll h-full bg-white'>
                {/* Header */}
                <div className='bg-gray-100 px-4 pt-6 pb-4 sm:px-6'>
                  <div className='flex items-start justify-between space-x-3'>
                    <div className='space-y-1'>
                      <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                        {title}
                      </DialogTitle>
                      {subtitle && <p className='text-sm font-medium text-gray-500'>{subtitle}</p>}
                    </div>
                    <div className='flex h-7 items-center'>
                      <button
                        type='button'
                        onClick={onClose}
                        className='relative text-gray-400 hover:text-gray-500'
                      >
                        <span className='absolute -inset-2.5' />
                        <span className='sr-only'>Close panel</span>
                        <XMarkIcon aria-hidden='true' className='h-6 w-6' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider container */}
                <div className='bg-white space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0'>
                  <div className='px-4 sm:px-6'>
                    {/* Content */}
                    <div className='space-y-6 sm:space-y-5'>{children}</div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default sideDrawer;
