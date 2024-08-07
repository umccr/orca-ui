import { FC, ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/utils';

export interface DialogButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}
export interface DialogProps {
  TitleIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  content?: string | ReactNode;
  open: boolean;
  onClose: () => void;
  closeBtn?: DialogButtonProps;
  confirmBtn?: DialogButtonProps;
}
const SimpleDialog: FC<DialogProps> = ({
  TitleIcon,
  title,
  content,
  open,
  onClose,
  closeBtn,
  confirmBtn,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                <button
                  type='button'
                  className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  onClick={onClose}
                >
                  <span className='sr-only'>closeBtn</span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='sm:flex sm:items-start'>
                {TitleIcon && (
                  <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10 sm:mr-4'>
                    <TitleIcon aria-hidden='true' className='h-6 w-6 text-red-600' />
                  </div>
                )}
                <div className='mt-3 text-center sm:mt-0 sm:text-left w-full'>
                  <DialogTitle as='h3' className='text-base font-semibold leading-6 text-gray-900'>
                    {title}
                  </DialogTitle>
                  <div className='mt-2 text-sm text-gray-500'>{content && content}</div>
                </div>
              </div>
            </div>
            {(closeBtn || confirmBtn) && (
              <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                {closeBtn && (
                  <button
                    type='button'
                    onClick={closeBtn.onClick}
                    className={classNames(
                      'inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto',
                      closeBtn.className ? closeBtn.className : ''
                    )}
                  >
                    {closeBtn.label}
                  </button>
                )}
                {confirmBtn && (
                  <button
                    type='button'
                    data-autofocus
                    onClick={confirmBtn.onClick}
                    className={classNames(
                      'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto',
                      confirmBtn.className ? confirmBtn.className : ''
                    )}
                  >
                    {confirmBtn.label}
                  </button>
                )}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SimpleDialog;
