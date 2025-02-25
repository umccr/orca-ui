import { BackdropWithText } from '@/components/common/backdrop';
import { Dialog } from '@/components/common/dialogs';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';
import { classNames } from '@/utils/commonUtils';

interface FileViewDialogProps {
  isOpenFileViewDialog: boolean;
  setIsOpenFileViewDialog: (isOpen: boolean) => void;
  fileName: string;
  fileContent: string;
  isLoading: boolean;
}

const FileViewDialog: FC<FileViewDialogProps> = ({
  isOpenFileViewDialog,
  setIsOpenFileViewDialog,
  fileName,
  fileContent,
  isLoading,
}) => {
  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  console.log('is loading', isLoading);
  return (
    <Dialog
      title={
        <div className='flex w-full items-center justify-between pr-12'>
          <div className='flex items-center gap-2'>
            <DocumentTextIcon className='h-5 w-5 text-gray-400' />
            <div className='flex flex-col'>
              <h3 className='text-base font-medium text-gray-900 dark:text-gray-100'>{fileName}</h3>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className={classNames(
              'flex items-center gap-2 rounded-md px-3 py-1.5',
              'text-xs font-medium',
              'bg-white dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors duration-200'
            )}
          >
            <ArrowDownTrayIcon className='h-4 w-4' />
            Download
          </button>
        </div>
      }
      open={isOpenFileViewDialog}
      onClose={() => setIsOpenFileViewDialog(false)}
      size='lg'
      className='bg-gray-100 dark:bg-gray-900'
    >
      <div className={classNames('relative', 'rounded-lg', 'bg-white dark:bg-gray-900')}>
        {isLoading ? (
          <div className='flex h-full w-full items-center justify-center'>
            <BackdropWithText text='Loading file content...' isVisible={true} />
          </div>
        ) : (
          <div
            className={classNames(
              'max-h-[60vh] overflow-auto',
              'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
              'scrollbar-track-transparent'
            )}
          >
            <pre
              className={classNames(
                'whitespace-pre',
                'font-mono text-sm leading-5',
                'text-gray-600 dark:text-gray-300',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'p-4'
              )}
            >
              {fileContent}
            </pre>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default FileViewDialog;
