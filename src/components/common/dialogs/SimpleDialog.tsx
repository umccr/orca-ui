import { FC, ReactNode, FunctionComponent, SVGProps } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';

export interface DialogButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}
export interface DialogProps {
  TitleIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  content?: string | ReactNode;
  open: boolean;
  onClose: () => void;
  closeBtn?: DialogButtonProps;
  confirmBtn?: DialogButtonProps;
  children?: ReactNode;
}
const SimpleDialog: FC<DialogProps> = ({
  TitleIcon,
  title,
  description,
  content,
  open,
  onClose,
  closeBtn,
  confirmBtn,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className='relative z-10'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900/90'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-8'>
        <div className='flex min-h-full items-center justify-center text-center'>
          <DialogPanel
            transition
            className='relative w-full max-w-[calc(100vw-2rem)] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 md:max-w-2xl dark:bg-gray-800'
          >
            <div className='px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                <button
                  type='button'
                  className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:bg-gray-800 dark:hover:text-gray-300 dark:focus:ring-blue-400/50 dark:focus:ring-offset-gray-800'
                  onClick={onClose}
                >
                  <span className='sr-only'>Close</span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='sm:flex sm:items-start'>
                {TitleIcon && (
                  <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:mr-4 sm:h-10 sm:w-10 dark:bg-gray-700'>
                    <TitleIcon
                      aria-hidden='true'
                      className='h-6 w-6 text-red-600 dark:text-red-400'
                    />
                  </div>
                )}
                <div className='mt-3 w-full text-center sm:mt-0 sm:text-left'>
                  <DialogTitle
                    as='h3'
                    className='text-base font-semibold leading-6 text-gray-900 dark:text-white'
                  >
                    {title}
                  </DialogTitle>
                  {description && (
                    <Description className='text-sm text-gray-500 dark:text-gray-400'>
                      {description}
                    </Description>
                  )}
                  <div className='mt-2 max-h-[60vh] overflow-auto text-sm text-gray-500 dark:text-gray-300'>
                    {!!content && content}
                    {!!children && children}
                  </div>
                </div>
              </div>
            </div>
            {(closeBtn || confirmBtn) && (
              <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700/50'>
                {closeBtn && (
                  <button
                    type='button'
                    onClick={closeBtn.onClick}
                    className={classNames(
                      'inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto dark:bg-blue-500 dark:hover:bg-red-600',
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
                      'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600',
                      confirmBtn.className ? confirmBtn.className : '',
                      confirmBtn.disabled
                        ? 'cursor-not-allowed text-gray-500 opacity-50 dark:text-gray-400'
                        : ''
                    )}
                    disabled={confirmBtn.disabled}
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
