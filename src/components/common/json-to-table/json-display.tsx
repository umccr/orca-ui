import { FC } from 'react';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toaster from '@/components/common/toaster';

interface JsonDisplayProps {
  isFetchingData: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | null;
}

const JsonDisplay: FC<JsonDisplayProps> = ({ isFetchingData, data }) => {
  return (
    <div className='relative m-2 rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-md transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800'>
      {isFetchingData ? <BackdropWithText text='Loading data...' isVisible={true} /> : null}
      {data ? (
        <div className='group flex flex-row justify-between gap-4'>
          <pre className='w-full whitespace-pre-wrap text-wrap break-all font-mono text-sm text-gray-800 dark:text-gray-200'>
            {JSON.stringify(data || {}, null, 2)}
          </pre>
          <div className='flex-shrink-0'>
            <ClipboardDocumentIcon
              className='h-5 w-5 cursor-pointer stroke-gray-500 opacity-0 transition-all duration-200 hover:stroke-blue-500 group-hover:opacity-100 dark:stroke-gray-400 dark:hover:stroke-blue-400'
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(data || {}, null, 2));
                toaster.success({
                  title: 'Copied to clipboard',
                });
              }}
            />
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
