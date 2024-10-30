import React, { useState } from 'react';
import { Button } from '@/components/common/buttons';
import { SpinnerWithText } from '@/components/common/spinner';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { useMutationSyncCustomCsv, useMutationSyncGsheet } from '@/api/metadata';
import { DetailedErrorBoundary } from '@/components/common/error';

type SyncType = 'gsheet' | 'presigned-csv';

export default function SyncPage() {
  const [syncType, setSyncType] = useState<SyncType>('gsheet');

  return (
    <div className='flex flex-col'>
      <div className='my-2'>
        <div className='text-md font-medium'>Select metadata source to sync with:</div>
        <SyncSelector onChange={setSyncType} value={syncType} />
      </div>

      {syncType && (
        <div className='pt-6 border-t-2 max-w-screen-sm'>
          <DetailedErrorBoundary>
            {syncType === 'gsheet' ? (
              <GsheetTrigger />
            ) : syncType === 'presigned-csv' ? (
              <PresignedCsvTrigger />
            ) : (
              <div>Something went wrong</div>
            )}
          </DetailedErrorBoundary>
        </div>
      )}
    </div>
  );
}

const SyncSelector = ({
  value,
  onChange,
}: {
  onChange: (p: SyncType) => void;
  value?: SyncType;
}) => {
  const RadioButton = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <div onClick={onChange} className='flex items-center cursor-pointer	my-4'>
      <input
        readOnly
        checked={checked}
        type='radio'
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
      />
      <label className='ms-2 text-sm'>{label}</label>
    </div>
  );

  return (
    <>
      <RadioButton
        checked={value == 'gsheet'}
        onChange={() => onChange('gsheet')}
        label='Google Tracking Sheet'
      />
      <RadioButton
        checked={value == 'presigned-csv'}
        onChange={() => onChange('presigned-csv')}
        label='Presigned CSV file'
      />
    </>
  );
};

const GsheetTrigger = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2017;
  const yearsArray = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  const [yearSelected, setYearSelected] = useState(currentYear);

  const { data, isPending, isError, isSuccess, error, mutate } = useMutationSyncGsheet({
    body: { year: yearSelected },
  });

  if (isPending) {
    return <SpinnerWithText text='Triggering sync with the Google Tracking Sheet...' />;
  }

  if (isError) {
    throw error;
  }

  if (isSuccess) {
    return <div className='flex items-center bg-green-100 text-green-800 h-18 p-4	'>{data}</div>;
  }

  return (
    <>
      <div>Year</div>
      <div className='text-xs font-light mb-2'>The Google sheet tab</div>
      <select
        value={yearSelected}
        onChange={(e) => setYearSelected(parseInt(e.target.value))}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
      >
        {yearsArray.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <Button
        onClick={() => {
          mutate();
        }}
        type='green'
        size='sm'
        className='w-full mt-6 justify-center'
      >
        <ArrowPathIcon className='h-5 w-5' />
        SYNC
      </Button>
    </>
  );
};

const PresignedCsvTrigger = () => {
  const [urlInput, setUrlInput] = useState<string>('');

  const { data, isPending, isError, isSuccess, error, mutate } = useMutationSyncCustomCsv({
    body: { presignedUrl: urlInput },
  });

  if (isPending) {
    return <SpinnerWithText text='Triggering sync with the Google Tracking Sheet...' />;
  }

  if (isError) {
    throw error;
  }

  if (isSuccess) {
    return <div className='flex items-center bg-green-100 text-green-800 h-18 p-4	'>{data}</div>;
  }

  return (
    <>
      <div>CSV Presigned URL</div>
      <div className='text-xs font-light mb-2'>
        Presigned URL of the CSV file. Format:{' '}
        <a
          className='hover:text-blue-700 text-blue-500'
          href='https://github.com/umccr/orcabus/blob/main/lib/workload/stateless/stacks/metadata-manager/README.md#custom-csv-file-loader'
        >
          GitHub
        </a>
      </div>
      <input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
      ></input>

      <Button
        onClick={() => {
          mutate();
        }}
        type='green'
        size='sm'
        className='w-full mt-6 justify-center'
      >
        <ArrowPathIcon className='h-5 w-5' />
        SYNC
      </Button>
    </>
  );
};
