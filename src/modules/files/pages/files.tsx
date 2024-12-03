import { SpinnerWithText } from '@/components/common/spinner';
import { Suspense, useState } from 'react';
import { FileAPITable, getTableColumn } from '../components/FileAPITable';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Badge } from '@/components/common/badges';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/common/buttons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';

const WORKFLOW_FILTER = [
  '*/bclconvert-interop-qc/*',
  '*/cttsov2/*',
  '*/oncoanalyser-wgts-dna-rna/*',
  '*/oncoanalyser-wgts-dna/*',
  '*/oncoanalyser-wgts-rna/*',
  '*/rnasum/*',
  '*/sash/*',
  '*/tumor_normal/*',
  '*/tumor-normal/*',
  '*/umccrise/*',
  '*/wgts-qc/*',
  '*/wgtsQc/*',
  '*/wts/*',
];
const FILE_TYPE_FILTER = ['*vcf.gz', '*fastq.gz', '*fastq.ora', '*bam', '*pdf', '*png', '*.html'];

const getBadgeType = (name: string) => {
  if (WORKFLOW_FILTER.includes(name)) {
    return 'primary';
  }
  if (FILE_TYPE_FILTER.includes(name)) {
    return 'secondary';
  }
  return 'unknown';
};

export default function FilesPage() {
  const { setQueryParams, getQueryParams } = useQueryParams();
  const searchS3Key = getQueryParams().key as string | string[] | undefined;
  const searchBucket = getQueryParams().bucket as string | string[] | undefined;
  const [searchBucketInput, setSearchBucketInput] = useState<string[]>(
    !searchBucket ? [] : Array.isArray(searchBucket) ? searchBucket : [searchBucket]
  );
  const [bucketCustomInputField, setBucketCustomInputField] = useState<string>('');

  const [searchS3KeyInput, setSearchS3KeyInput] = useState<string[]>(
    !searchS3Key ? [] : Array.isArray(searchS3Key) ? searchS3Key : [searchS3Key]
  );
  const [s3KeyCustomInputField, setS3KeyCustomInputField] = useState<string>('');

  const descKeyWidth = 'w-16';
  return (
    <div className='flex flex-col'>
      <h1 className='mb-4 font-bold'>File Browser</h1>
      <div className='flex flex-col'>
        {/* Bucket */}
        <div className='flex flex-row items-center'>
          <div className={`${descKeyWidth} text-sm flex flex-row`}>Bucket</div>
          <div className='rounded-lg w-full border py-1 px-1 flex flex-wrap'>
            {searchBucketInput.map((key, index) => (
              <Badge className='mx-1 my-1' key={`key-filter-${index}`} type='warning'>
                {key}
                <div className='pl-2 '>
                  <XMarkIcon />
                </div>
                <div
                  className='inline cursor-pointer'
                  onClick={() => {
                    setSearchBucketInput((prv) => prv.filter((val) => val !== key));
                  }}
                >
                  <XMarkIcon aria-hidden='true' className='h-3 w-3' />
                </div>
              </Badge>
            ))}
            <input
              className='flex-grow min-w-60 text-sm px-2 py-2 focus-visible:outline-none border-none'
              onBlur={() => {
                if (bucketCustomInputField && !searchBucketInput.includes(bucketCustomInputField)) {
                  setSearchBucketInput((prv) => [...prv, bucketCustomInputField]);
                }
                setBucketCustomInputField('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!searchBucketInput.includes(bucketCustomInputField)) {
                    setSearchBucketInput((prv) => [...prv, bucketCustomInputField]);
                  }
                  setBucketCustomInputField('');
                }
              }}
              onChange={(e) => {
                setBucketCustomInputField(e.target.value.trim());
              }}
              value={bucketCustomInputField}
              id='search'
              name='search'
              placeholder={'Enter matching bucket'}
              type='search'
            />
          </div>
        </div>

        {/* S3 Key */}
        <div className='flex flex-row items-center mt-2'>
          <div className={`${descKeyWidth} text-sm flex flex-row`}>
            Key
            <Tooltip
              text={`The search matches values within S3 keys. Use an asterisk (*) as a wildcard to match any sequence of characters. For example, to search based on a portalRunId folder, use '*/123456/*'. Some shortcut filters are provided below.`}
              position='right'
              background='white'
            >
              <InformationCircleIcon className='mx-2 h-5 2-5' />
            </Tooltip>
          </div>
          <div className='rounded-lg w-full border py-1 px-1 flex flex-wrap'>
            {searchS3KeyInput.map((key, index) => (
              <Badge className='mx-1 my-1' key={`key-filter-${index}`} type={getBadgeType(key)}>
                {key}
                <div className='pl-2 '>
                  <XMarkIcon />
                </div>
                <div
                  className='inline cursor-pointer'
                  onClick={() => {
                    setSearchS3KeyInput((prv) => prv.filter((val) => val !== key));
                  }}
                >
                  <XMarkIcon aria-hidden='true' className='h-3 w-3' />
                </div>
              </Badge>
            ))}
            <input
              className='flex-grow min-w-60 text-sm px-2 py-2 focus-visible:outline-none border-none'
              onBlur={() => {
                if (s3KeyCustomInputField && !searchS3KeyInput.includes(s3KeyCustomInputField)) {
                  setSearchS3KeyInput((prv) => [...prv, s3KeyCustomInputField]);
                }
                setS3KeyCustomInputField('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!searchS3KeyInput.includes(s3KeyCustomInputField)) {
                    setSearchS3KeyInput((prv) => [...prv, s3KeyCustomInputField]);
                  }
                  setS3KeyCustomInputField('');
                }
              }}
              onChange={(e) => {
                setS3KeyCustomInputField(e.target.value.trim());
              }}
              value={s3KeyCustomInputField}
              id='search'
              name='search'
              placeholder={'Enter S3 key pattern (wildcard supported)'}
              type='search'
            />
          </div>
        </div>
        {/* Shortcut filter */}
        <div className='my-2'>
          {[...WORKFLOW_FILTER, ...FILE_TYPE_FILTER].map((name, idx) => (
            <div
              className='inline cursor-pointer'
              key={`key-add-filter-${idx}`}
              onClick={() => {
                if (!searchS3KeyInput.includes(name)) {
                  setSearchS3KeyInput((prv) => {
                    return [...prv, name];
                  });
                }
              }}
            >
              <Badge className='mx-1 my-1' key={`key-filter-${idx}`} type={getBadgeType(name)}>
                {name}
              </Badge>
            </div>
          ))}
        </div>
        <div className='w-full flex justify-end'>
          <Button
            onClick={() => {
              setQueryParams({ key: [], bucket: [] });
              setSearchS3KeyInput([]);
              setS3KeyCustomInputField('');
            }}
            className='mr-3 border'
            type='gray'
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setQueryParams({ key: searchS3KeyInput, bucket: searchBucketInput });
            }}
            type='green'
          >
            Search
          </Button>
        </div>
      </div>

      {/* Only show the table if the key filter exist! */}
      {searchS3Key && (
        <Suspense fallback={<SpinnerWithText className='mt-4' text='Fetching related files ...' />}>
          <FileAPITable
            additionalQueryParam={{
              'key[]': searchS3Key,
              'bucket[]': searchBucket,
            }}
            tableColumn={getTableColumn({ isHideKeyPrefix: false })}
          />
        </Suspense>
      )}
    </div>
  );
}
