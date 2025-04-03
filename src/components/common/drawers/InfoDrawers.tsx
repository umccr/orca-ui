import { FC, ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';

type DrawerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  dialogPanelClassName?: string;
  content: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ isOpen, setIsOpen, title, dialogPanelClassName, content }) => {
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className='relative z-50'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300 ease-in-out data-closed:opacity-0 dark:bg-black/50'
      />

      <div className='fixed inset-0 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex w-full pl-10'>
            <DialogPanel
              transition
              className={classNames(
                'pointer-events-auto w-full max-w-md transform transition duration-300 ease-in-out data-closed:translate-x-full',
                'bg-white shadow-lg shadow-black/10 dark:bg-gray-900 dark:shadow-black/30',
                dialogPanelClassName ?? ''
              )}
            >
              <div className='flex h-full flex-col overflow-y-auto'>
                <div className='sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900'>
                  <div className='flex items-center justify-between'>
                    <DialogTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {title}
                    </DialogTitle>
                    <button
                      type='button'
                      onClick={() => setIsOpen(false)}
                      className='rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-400 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-900'
                    >
                      <span className='sr-only'>Close panel</span>
                      <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                    </button>
                  </div>
                </div>
                <div className='relative flex-1 px-4 py-6 text-gray-900 sm:px-6 dark:text-gray-100'>
                  {content}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Drawer;
