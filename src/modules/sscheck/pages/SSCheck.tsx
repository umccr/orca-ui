import { useState } from 'react';
import { Button } from '@/components/common/buttons';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
const logLevelsArray: LogLevel[] = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export default function SSCheckPage() {
  const [loggerType, setLoggerType] = useState<LogLevel>('ERROR');
  const [file, setFile] = useState<File | null>(null);

  console.log({
    loggerType,
    file,
  });

  return (
    <div className='flex flex-col max-w-screen-sm'>
      <h1 className='mb-4 font-bold'>Sample Sheet Checker</h1>

      {/* Set logger */}
      <div className='flex flex-row items-center mt-2'>
        <div className='w-44 text-sm flex flex-row'>Logging type</div>
        <div className='rounded-lg w-full py-1 px-1 flex flex-wrap'>
          <select
            value={loggerType}
            onChange={(e) => setLoggerType(e.target.value as LogLevel)}
            className='h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'
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
      <div className='flex flex-row items-center mt-2'>
        <div className='w-44 text-sm flex flex-row'>Sample sheet file</div>
        <div className='rounded-lg w-full py-1 px-1 flex flex-wrap'>
          <input
            className='h-10 file:h-full file:border-0 placeholder-gray-400 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none'
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
          // mutate();
        }}
        type='green'
        size='sm'
        className='w-full mt-6 justify-center'
      >
        <MagnifyingGlassIcon className='h-5 w-5' />
        Check
      </Button>
    </div>
  );
}
