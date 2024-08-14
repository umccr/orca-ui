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
    <Dialog open={isOpen} onClose={setIsOpen} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-magpie-light-75 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0'
      />

      <div className='fixed inset-0 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
            <DialogPanel
              transition
              className={classNames(
                'pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700',
                dialogPanelClassName ? dialogPanelClassName : ''
              )}
            >
              <div className='flex h-full flex-col overflow-auto bg-white pt-6 shadow-xl'>
                <div className='px-4 sm:px-6'>
                  <div className='flex items-start justify-between'>
                    <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                      {title}
                    </DialogTitle>
                    <div className='ml-3 flex h-7 items-center'>
                      <button
                        type='button'
                        onClick={() => setIsOpen(false)}
                        className='relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      >
                        <span className='absolute -inset-2.5' />
                        <span className='sr-only'>Close panel</span>
                        <XMarkIcon aria-hidden='true' className='h-6 w-6' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='relative mt-6 flex-1 px-4 sm:px-6'>{isOpen && content}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Drawer;
