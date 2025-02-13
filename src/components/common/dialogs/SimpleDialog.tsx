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
  title: string | ReactNode;
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
    <Dialog open={open} onClose={onClose} className='relative z-50'>
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900/90'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-8'>
        <div className='flex min-h-full items-center justify-center'>
          <DialogPanel
            transition
            className='relative w-full max-w-[calc(100vw-2rem)] transform rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5 transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 md:max-w-2xl lg:max-w-7xl dark:bg-gray-800 dark:ring-white/5'
          >
            {/* Close button */}
            <div className='absolute right-4 top-4'>
              <button
                type='button'
                onClick={onClose}
                className='rounded-lg p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:hover:text-gray-300 dark:focus:ring-blue-400/50 dark:focus:ring-offset-gray-800'
              >
                <span className='sr-only'>Close</span>
                <XMarkIcon className='h-5 w-5' />
              </button>
            </div>

            <div className='p-6'>
              <div className='flex w-full items-start gap-4'>
                {TitleIcon && (
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
                    <TitleIcon className='h-5 w-5' aria-hidden='true' />
                  </div>
                )}

                <div className='w-full flex-1'>
                  <DialogTitle
                    as='h3'
                    className='text-lg font-semibold leading-6 text-gray-900 dark:text-white'
                  >
                    {title}
                  </DialogTitle>

                  {description && (
                    <Description className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                      {description}
                    </Description>
                  )}

                  {(content || children) && (
                    <div className='mt-4 max-h-[60vh] overflow-auto text-sm text-gray-600 dark:text-gray-300 [&>:first-child]:mt-0 [&>:last-child]:mb-0'>
                      {content}
                      {children}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(closeBtn || confirmBtn) && (
              <div className='flex flex-col-reverse gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end dark:border-gray-700'>
                {confirmBtn && (
                  <button
                    type='button'
                    onClick={confirmBtn.onClick}
                    disabled={confirmBtn.disabled}
                    className={classNames(
                      'inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                      confirmBtn.disabled
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                        : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-400',
                      confirmBtn.className || ''
                    )}
                  >
                    {confirmBtn.label}
                  </button>
                )}

                {closeBtn && (
                  <button
                    type='button'
                    onClick={closeBtn.onClick}
                    className={classNames(
                      'inline-flex justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:ring-gray-400',
                      closeBtn.className || ''
                    )}
                  >
                    {closeBtn.label}
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
