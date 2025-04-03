import React, { useState } from 'react';
import { Button } from '@/components/common/buttons';
import { SpinnerWithText } from '@/components/common/spinner';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/20/solid';
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
        <div className='max-w-(--breakpoint-sm) border-t-2 pt-6'>
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
    <div onClick={onChange} className='my-4 flex cursor-pointer items-center'>
      <input
        readOnly
        checked={checked}
        type='radio'
        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500'
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

const SuccessTriggerWrapper = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) => (
  <div className='relative flex h-18 flex-col items-center bg-green-100 p-4 text-green-800'>
    {children}
    <div className='mt-2 text-xs italic'>*sync may take up to 15 minutes</div>
    {onClose && (
      <button
        onClick={onClose}
        className='absolute top-2 right-2 text-green-800 hover:text-green-600'
      >
        <XMarkIcon className='h-5 w-5' />
      </button>
    )}
  </div>
);

const GsheetTrigger = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2017;
  const yearsArray = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);

  const [yearSelected, setYearSelected] = useState(currentYear);

  const { data, isPending, isError, isSuccess, error, mutate, reset } = useMutationSyncGsheet({
    body: { year: yearSelected },
  });

  if (isPending) {
    return <SpinnerWithText text='Triggering sync with the Google tracking sheet' />;
  }

  if (isError) {
    throw error;
  }

  if (isSuccess) {
    return (
      <SuccessTriggerWrapper
        onClose={() => {
          setYearSelected(currentYear);
          reset();
        }}
      >
        {data}
      </SuccessTriggerWrapper>
    );
  }

  return (
    <>
      <div>Year</div>
      <div className='mb-2 text-xs font-light'>The Google sheet tab</div>
      <select
        value={yearSelected}
        onChange={(e) => setYearSelected(parseInt(e.target.value))}
        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
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
        className='mt-6 w-full justify-center'
      >
        <ArrowPathIcon className='h-5 w-5' />
        SYNC
      </Button>
    </>
  );
};

const PresignedCsvTrigger = () => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const { data, isPending, isError, isSuccess, error, mutate, reset } = useMutationSyncCustomCsv({
    body: { presignedUrl: urlInput, reason: reason ? reason : undefined },
  });

  if (isPending) {
    return <SpinnerWithText text='Triggering sync from given presigned url' />;
  }

  if (isError) {
    throw error;
  }

  if (isSuccess) {
    return (
      <SuccessTriggerWrapper
        onClose={() => {
          setUrlInput('');
          setReason('');
          reset();
        }}
      >
        {data}
      </SuccessTriggerWrapper>
    );
  }

  return (
    <>
      <div className='mb-4'>CSV Presigned URL</div>

      {/* URL input */}
      <div className='mt-4 text-xs font-medium'>Presigned URL of the CSV file.</div>
      <div className='mb-2 text-xs font-light'>
        Format:{' '}
        <a
          className='text-blue-500 hover:text-blue-700'
          href='https://github.com/umccr/orcabus/blob/main/lib/workload/stateless/stacks/metadata-manager/README.md#custom-csv-file-loader'
        >
          GitHub
        </a>
      </div>

      <input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
      />

      {/* Reason input */}
      <div className='mt-4 text-xs font-medium'>Reason</div>
      <div className='mb-2 text-xs font-light'>Optional reason or comment for the sync </div>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
      />

      <Button
        onClick={() => {
          mutate();
        }}
        type='green'
        size='sm'
        className='mt-6 w-full justify-center'
      >
        <ArrowPathIcon className='h-5 w-5' />
        SYNC
      </Button>
    </>
  );
};
