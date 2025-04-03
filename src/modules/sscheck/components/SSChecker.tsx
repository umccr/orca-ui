import { useState } from 'react';
import { Button } from '@/components/common/buttons';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { usePostSSCheck } from '@/api/sscheck';
import { SpinnerWithText } from '@/components/common/spinner';
import DisplayResult from './SuccessResponse';

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
    <>
      {/* Set logger */}
      <div className='mt-2 flex flex-row items-center'>
        <div className='flex w-44 flex-row text-sm'>Logging type</div>
        <div className='flex w-full flex-wrap rounded-lg px-1 py-1'>
          <select
            value={loggerType}
            onChange={(e) => setLoggerType(e.target.value as LogLevel)}
            className='h-10 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
          >
            {logLevelsArray.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Set file */}
      <div className='mt-2 flex flex-row items-center'>
        <div className='flex w-44 flex-row text-sm'>Sample sheet file</div>
        <div className='flex w-full flex-wrap rounded-lg px-1 py-1'>
          <input
            className='block h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:cursor-pointer file:rounded-l-md file:border-0 file:border-r file:border-gray-300 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-50 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:file:border-gray-600 dark:file:bg-gray-800 dark:file:text-gray-400 dark:hover:file:bg-gray-700'
            type='file'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
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
    </>
  );
};
