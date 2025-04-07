import { useState } from 'react';
import { Button } from '@/components/common/buttons';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { usePostSSCheck } from '@/api/sscheck';
import { SpinnerWithText } from '@/components/common/spinner';
import DisplayResult from './SuccessResponse';
import { classNames } from '@/utils/commonUtils';

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
const logLevelsArray: LogLevel[] = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export const SSChecker = () => {
  const [loggerType, setLoggerType] = useState<LogLevel>('ERROR');
  const [file, setFile] = useState<File | null>(null);

  const formData = new FormData();
  if (file) formData.append('file', file);
  formData.append('logLevel', loggerType);
  const { data, isPending, isError, isSuccess, error, mutate, reset } = usePostSSCheck({
    body: formData,
  });

  if (isPending) {
    return <SpinnerWithText text={`Checking tracking sheet (${file?.name})`} />;
  }

  if (isError) {
    throw error;
  }

  if (isSuccess) {
    return (
      <DisplayResult
        validationResponse={data}
        onClose={() => {
          setFile(null);
          reset();
        }}
      />
    );
  }
  return (
    <div className='mt-2 flex flex-col gap-2'>
      {/* Set logger */}
      <div className='mt-2 flex flex-row items-center'>
        <div className='flex w-44 flex-row text-sm text-gray-700 dark:text-gray-300'>
          Logging type
        </div>
        <div className='relative flex w-full flex-wrap'>
          <select
            value={loggerType}
            onChange={(e) => setLoggerType(e.target.value as LogLevel)}
            className={classNames(
              'h-10 w-40 appearance-none rounded-lg px-3 py-2 text-sm',
              'bg-white dark:bg-gray-800',
              'border border-gray-300 dark:border-gray-700',
              'text-gray-900 dark:text-gray-100',
              'focus:border-blue-500 dark:focus:border-blue-400',
              'focus:ring-1 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-400',
              'transition-colors duration-200'
            )}
          >
            {logLevelsArray.map((level) => (
              <option key={level} value={level} className='bg-white dark:bg-gray-800'>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Set file */}
      <div className='mt-2 flex flex-row items-center'>
        <div className='flex w-44 flex-row text-sm text-gray-700 dark:text-gray-300'>
          Sample sheet file
        </div>
        <div className='flex w-full flex-wrap'>
          <div className='relative w-full'>
            <input
              className={classNames(
                'block h-10 w-full rounded-lg text-sm',
                'bg-white dark:bg-gray-800',
                'border border-gray-300 dark:border-gray-700',
                'text-gray-900 dark:text-gray-100',
                'focus:border-blue-500 dark:focus:border-blue-400',
                'focus:ring-1 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-400',
                'transition-colors duration-200',
                'file:mr-4 file:h-10 file:border-0 file:border-r',
                'file:border-gray-300 dark:file:border-gray-600',
                'file:bg-gray-50 dark:file:bg-gray-700',
                'file:px-4 file:py-2',
                'file:text-sm file:font-medium',
                'file:text-gray-700 dark:file:text-gray-300',
                'hover:file:bg-gray-100 dark:hover:file:bg-gray-600',
                'cursor-pointer file:cursor-pointer'
              )}
              type='file'
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          mutate();
        }}
        type='green'
        size='sm'
        className='mt-3 w-full justify-center'
      >
        <MagnifyingGlassIcon className='h-5 w-5' />
        Check
      </Button>
    </div>
  );
};
