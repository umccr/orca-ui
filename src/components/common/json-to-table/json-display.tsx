import { FC, useState } from 'react';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toaster from '@/components/common/toaster';
import { classNames } from '@/utils/commonUtils';
interface JsonDisplayProps {
  isFetchingData: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | null;
  className?: string;
}

const JsonDisplay: FC<JsonDisplayProps> = ({ isFetchingData, data, className }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data || {}, null, 2));
      setIsCopied(true);
      toaster.success({
        title: 'Copied Successfully',
        message: 'JSON data copied to clipboard',
      });
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
    } catch (err) {
      toaster.error({
        title: 'Failed to copy',
        message: 'Error: ' + err,
      });
    }
  };

  return (
    <div
      className={classNames(
        'relative rounded-lg border border-gray-200 bg-gradient-to-b from-gray-50/80 to-white p-4 transition-all duration-200 dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-800/80',
        className
      )}
    >
      {isFetchingData ? <BackdropWithText text='Loading data...' isVisible={true} /> : null}
      {data ? (
        <div className='group flex flex-row justify-between gap-4'>
          <pre className='w-full whitespace-pre-wrap text-wrap break-all font-mono text-sm text-gray-800 dark:text-gray-200'>
            {JSON.stringify(data || {}, null, 2)}
          </pre>
          <div className='flex-shrink-0'>
            {isCopied ? (
              <CheckCircleIcon className='h-6 w-6 cursor-pointer stroke-gray-500 opacity-0 transition-all duration-200 hover:stroke-blue-500 group-hover:opacity-100 dark:stroke-gray-400 dark:hover:stroke-blue-400' />
            ) : (
              <ClipboardDocumentIcon
                className='h-6 w-6 cursor-pointer stroke-gray-500 opacity-0 transition-all duration-200 hover:stroke-blue-500 group-hover:opacity-100 dark:stroke-gray-400 dark:hover:stroke-blue-400'
                onClick={handleCopy}
              />
            )}
          </div>
        </div>
      ) : (
        <div className='flex w-full flex-col gap-2'>
          {[...Array(10)].map((_, index) => (
            <Skeleton
              key={index}
              className='h-4 w-full'
              baseColor={
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? '#374151'
                  : '#f3f4f6'
              }
              highlightColor={
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? '#4B5563'
                  : '#e5e7eb'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonDisplay;
