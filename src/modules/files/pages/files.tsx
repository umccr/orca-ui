import { SpinnerWithText } from '@/components/common/spinner';
import { Suspense, useState } from 'react';
import { FileAPITable, getTableColumn } from '../components/FileAPITable';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Badge } from '@/components/common/badges';
import { Button } from '@/components/common/buttons';
import InputBadgeBox from '../components/InputBadgeBox';

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
const FILE_TYPE_FILTER = [
  '*.vcf.gz',
  '*.fastq.gz',
  '*.fastq.ora',
  '*.bam',
  '*.pdf',
  '*.png',
  '*.html',
];

const getBadgeType = (name: string) => {
  if (WORKFLOW_FILTER.includes(name)) {
    return 'primary';
  }
  if (FILE_TYPE_FILTER.includes(name)) {
    return 'secondary';
  }
  return 'unknown';
};

interface InputBadgeBoxType {
  operator: 'and' | 'or';
  inputState: string[];
  inputDraft: string;
}

export default function FilesPage() {
  const { setQueryParams, getQueryParams } = useQueryParams();
  const s3KeyParam = getQueryParams().key as string | string[] | undefined;
  const s3KeyOpParam = getQueryParams().keyOp as string | undefined;

  const bucketParam = getQueryParams().bucket as string | string[] | undefined;
  const bucketOpParam = getQueryParams().bucketOp as string | undefined;

  const portalRunIdParam = getQueryParams().portalRunId as string | string[] | undefined;

  // For PortalRunId
  const [portalRunIdInput, setPortalRunIdInput] = useState<InputBadgeBoxType>({
    operator: 'or',
    inputState: !portalRunIdParam
      ? []
      : Array.isArray(portalRunIdParam)
        ? portalRunIdParam
        : [portalRunIdParam],
    inputDraft: '',
  });

  // For S3 bucket
  const [bucketInput, setBucketInput] = useState<InputBadgeBoxType>({
    operator: 'or',
    inputState: !bucketParam ? [] : Array.isArray(bucketParam) ? bucketParam : [bucketParam],
    inputDraft: '',
  });

  // For S3 key
  const [s3KeyInput, setS3KeyInput] = useState<InputBadgeBoxType>({
    operator: 'and',
    inputState: !s3KeyParam ? [] : Array.isArray(s3KeyParam) ? s3KeyParam : [s3KeyParam],
    inputDraft: '',
  });

  return (
    <div className='flex flex-col'>
      <h1 className='mb-4 font-bold'>File Browser</h1>
      <div className='flex flex-col'>
        {/* PortalRunId */}
        <InputBadgeBox
          label='Portal Run ID'
          inputState={portalRunIdInput.inputState}
          inputDraft={portalRunIdInput.inputDraft}
          setInput={setPortalRunIdInput}
          placeholder='Enter matching portal run id'
          badgeType={() => 'success'}
          operator={portalRunIdInput.operator}
          setOperator={(operator) => setPortalRunIdInput((prev) => ({ ...prev, operator }))}
          allowedOperator={['or']}
        />

        {/* Bucket */}
        <InputBadgeBox
          label='Bucket'
          inputState={bucketInput.inputState}
          inputDraft={bucketInput.inputDraft}
          setInput={setBucketInput}
          placeholder='Enter matching bucket'
          badgeType={() => 'warning'}
          operator={bucketInput.operator}
          setOperator={(operator) => setBucketInput((prev) => ({ ...prev, operator }))}
          allowedOperator={['and', 'or']}
        />

        {/* S3 Key */}
        <InputBadgeBox
          label='Key'
          tooltipText={`The search matches values within S3 keys. Use an asterisk (*) as a wildcard to match any sequence of characters. For example, to search based on a portalRunId folder, use '*/123456/*'. Some shortcut filters are provided below.`}
          inputState={s3KeyInput.inputState}
          inputDraft={s3KeyInput.inputDraft}
          setInput={setS3KeyInput}
          placeholder='Enter S3 key pattern (wildcard supported)'
          badgeType={getBadgeType}
          operator={s3KeyInput.operator}
          setOperator={(operator) => setS3KeyInput((prev) => ({ ...prev, operator }))}
          allowedOperator={['and', 'or']}
        />

        {/* Shortcut filter */}
        <div className='my-2'>
          {[...WORKFLOW_FILTER, ...FILE_TYPE_FILTER].map((name, idx) => (
            <div
              className='inline cursor-pointer'
              key={`key-add-filter-${idx}`}
              onClick={() => {
                if (!s3KeyInput['inputState'].includes(name)) {
                  setS3KeyInput((prv) => ({
                    ...prv,
                    inputState: [...prv['inputState'], name],
                  }));
                }
              }}
            >
              <Badge className='mx-1 my-1' key={`key-filter-${idx}`} type={getBadgeType(name)}>
                {name}
              </Badge>
            </div>
          ))}
        </div>
        <div className='flex w-full justify-end'>
          <Button
            onClick={() => {
              setQueryParams({ key: [], bucket: [] });

              setS3KeyInput((prv) => ({
                ...prv,
                inputState: [],
                inputDraft: '',
              }));
              setBucketInput((prv) => ({
                ...prv,
                inputState: [],
                inputDraft: '',
              }));
              setPortalRunIdInput((prv) => ({
                ...prv,
                inputState: [],
                inputDraft: '',
              }));
            }}
            className='mr-3 border'
            type='gray'
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setQueryParams({
                key: s3KeyInput['inputState'],
                keyOp: s3KeyInput['operator'],
                bucket: bucketInput['inputState'],
                bucketOp: bucketInput['operator'],
                portalRunId: portalRunIdInput['inputState'],
              });
            }}
            type='green'
          >
            Search
          </Button>
        </div>
      </div>
      {/* Only show the table if the key or portalRunId filter exist! */}
      {(s3KeyParam || portalRunIdParam) && (
        <Suspense fallback={<SpinnerWithText className='mt-4' text='Fetching related files ...' />}>
          <FileAPITable
            additionalQueryParam={{
              [`key[${s3KeyOpParam ?? s3KeyInput['operator']}][]`]: s3KeyParam,
              [`bucket[${bucketOpParam ?? bucketInput['operator']}][]`]: bucketParam,
              [`attributes[portalRunId][]`]: portalRunIdParam,
            }}
            tableColumn={getTableColumn({ isHideKeyPrefix: false })}
          />
        </Suspense>
      )}
    </div>
  );
}
