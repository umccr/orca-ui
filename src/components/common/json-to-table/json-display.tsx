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
    <div className='relative bg-gray-50 border border-gray-300 rounded-md m-2 p-2 shadow-sm '>
      {isFetchingData ? <BackdropWithText text='Loading data...' isVisible={true} /> : null}
      {data ? (
        <div className='group flex flex-row justify-between'>
          <pre className='whitespace-pre-wrap text-wrap break-all text-xs text-gray-800'>
            {JSON.stringify(data || {}, null, 2)}
          </pre>
          <ClipboardDocumentIcon
            className='w-5 h-5 cursor-pointer stroke-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data || {}, null, 2));
              toaster.success({
                title: `Copied data to clipboard`,
              });
            }}
          />
        </div>
      ) : (
        <div className='flex flex-col gap-2 w-80'>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className='h-4 w-full' />
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonDisplay;
