import { Suspense, useEffect, useState } from 'react';
import { PortalRunIdDropdown } from '../../components/library/PortalRunIdDropdown';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
import { FileAPITable, getTableColumn } from '@/modules/files/components/FileAPITable';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useSuspenseWorkflowRunListModel } from '@/api/workflow';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { WorkflowDialogDetail } from '../../components/library/WorkflowDialogDetail';
import { Badge } from '@/components/common/badges';
import InputBadgeBox, { InputBadgeBoxType } from '@/modules/files/components/InputBadgeBox';
import { Button } from '@/components/common/buttons';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { areArraysEqual } from '@/modules/files/components/utils';
import { Checkbox } from '@/components/common/checkbox';

interface KeyPatternType {
  label: string;
  pattern: string | string[];
}
const FILE_TYPE_FILTER = [
  { label: 'VCF', pattern: '*.vcf.gz' },
  { label: 'FASTQ (.gz)', pattern: '*.fastq.gz' },
  { label: 'FASTQ (.ora)', pattern: '*.fastq.ora' },
  { label: 'BAM', pattern: '*.bam' },
  { label: 'PDF', pattern: '*.pdf' },
  { label: 'PNG', pattern: '*.png' },
  { label: 'HTML', pattern: '*.html' },
  { label: 'TSV', pattern: '*.tsv' },
  { label: 'JSON', pattern: '*.json' },
];

const WORKFLOW_TYPE_FILTER: KeyPatternType[] = [
  { label: 'cancer report tables', pattern: '*/cancer_report_tables/*.tsv.gz' },
  { label: 'cancer report', pattern: '*cancer_report.html' },
  {
    label: 'small_variant vcf',
    pattern: ['*/small_variants/*.vcf.gz', '*/small_variants/*.maf'],
  },
  {
    label: 'germline vcf',
    pattern: '*dragen_germline*.vcf.gz',
  },
  { label: 'multiqc', pattern: '*multiqc*.html' },
  { label: 'pcgr cpsr', pattern: ['*cpsr.html', '*pcgr.html'] },
  { label: 'coverage', pattern: ['*tumor.cacao.html', '*normal.cacao.html'] },
  { label: 'circos', pattern: '*/purple/*circos*.png' },
];

const DEFAULT_FILTER_OP = 'and';

const getBadgeTypeFromPattern = (name: string) => {
  const isWorkflowMatch = WORKFLOW_TYPE_FILTER.some(({ pattern }) =>
    Array.isArray(pattern) ? pattern.includes(name) : pattern === name
  );
  if (isWorkflowMatch) return 'primary';

  const isFileTypeMatch = FILE_TYPE_FILTER.some(({ pattern }) => pattern === name);
  if (isFileTypeMatch) return 'secondary';

  return 'unknown';
};

const getBadgeTypeFromLabel = (name: string) => {
  const isWorkflowMatch = WORKFLOW_TYPE_FILTER.some(({ label }) => label === name);
  if (isWorkflowMatch) return 'primary';

  const isFileTypeMatch = FILE_TYPE_FILTER.some(({ label }) => label === name);
  if (isFileTypeMatch) return 'secondary';

  return 'unknown';
};

export default function LibraryWorkflowPage() {
  const { libraryOrcabusId, portalRunId, workflowType } = useParams();
  const { pathname } = useLocation();
  const { setQueryParams, getQueryParams } = useQueryParams();
  const searchKey = getQueryParams().key as string | string[] | undefined;
  const searchKeyOpParam = getQueryParams().keyOp as 'and' | 'or' | undefined;

  // For S3 key
  const sanitizedSearchKey = !searchKey ? [] : Array.isArray(searchKey) ? searchKey : [searchKey];
  const [s3KeyInput, setS3KeyInput] = useState<InputBadgeBoxType>({
    operator: searchKeyOpParam ? searchKeyOpParam : DEFAULT_FILTER_OP,
    inputState: sanitizedSearchKey,
    inputDraft: '',
  });

  const [isHidePrefix, setIsHidePrefix] = useState(true);

  useEffect(() => {
    if (!searchKey) {
      setS3KeyInput({
        operator: DEFAULT_FILTER_OP,
        inputState: [],
        inputDraft: '',
      });
    }
  }, [searchKey, pathname]);

  if (!libraryOrcabusId || !workflowType) {
    throw new Error('Invalid URL!');
  }

  const workflowRun = useSuspenseWorkflowRunListModel({
    params: {
      query: {
        libraries__orcabusId: libraryOrcabusId,
        workflow__workflowName: workflowType,
        ordering: '-portalRunId',
        rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE,
      },
    },
  }).data;

  const workflowRunResults = workflowRun?.results;
  if (!workflowRunResults?.length) {
    throw new Error('No workflow run found!');
  }
  if (!portalRunId) {
    return <Navigate to={`${workflowRunResults[0].portalRunId}`} />;
  }

  // If portalRunId is not found in the list of workflowRun, it is invalid link
  const currentWorkflowRunDetail = workflowRunResults.find((i) => i.portalRunId === portalRunId);
  if (!currentWorkflowRunDetail) {
    throw new Error('Invalid link!');
  }

  const isMultipleRuns = workflowRunResults.length > 1;
  const isSearchNeedUpdate =
    !areArraysEqual(s3KeyInput.inputState, sanitizedSearchKey) ||
    (!!searchKeyOpParam && s3KeyInput.operator !== searchKeyOpParam);

  return (
    <div>
      {/* Header */}
      <div className='flex flex-row justify-between gap-2'>
        <div className='flex flex-row'>
          <h1 className='flex h-full items-center font-bold'>{`${workflowType}`}</h1>
          <WorkflowDialogDetail
            portalRunId={portalRunId}
            workflowDetail={currentWorkflowRunDetail}
          />
        </div>

        {isMultipleRuns && (
          <div className='flex flex-row'>
            <PortalRunIdDropdown
              workflowType={workflowType}
              portalRunId={portalRunId}
              libraryOrcabusId={libraryOrcabusId}
              workflowRunRes={workflowRun}
            />
          </div>
        )}
      </div>

      {/* Body */}
      {portalRunId && (
        <div className='mt-2 flex flex-col gap-2'>
          <InputBadgeBox
            label='Key'
            labelClassName='w-10'
            tooltipText={`The search matches values within S3 keys. Use an asterisk (*) as a wildcard to match any sequence of characters. An asterisk is added at the beginning and end of the search term.`}
            inputState={s3KeyInput.inputState}
            inputDraft={s3KeyInput.inputDraft}
            setInput={setS3KeyInput}
            placeholder='Enter S3 key pattern (wildcard supported)'
            badgeType={getBadgeTypeFromPattern}
            operator={s3KeyInput.operator}
            setOperator={(operator) => setS3KeyInput((prev) => ({ ...prev, operator }))}
            allowedOperator={['and', 'or']}
          />
          <Suspense fallback={<SpinnerWithText text='Fetching related files ...' />}>
            <div className='my-2'>
              {[...WORKFLOW_TYPE_FILTER, ...FILE_TYPE_FILTER].map((filter, idx) => {
                const label = filter.label;
                const pattern = filter.pattern;
                return (
                  <div
                    className='inline cursor-pointer'
                    key={`key-add-filter-${idx}`}
                    onClick={() => {
                      const isMultiPattern = Array.isArray(pattern);
                      const flatPattern = isMultiPattern ? pattern.flat() : [pattern];
                      setS3KeyInput({
                        inputDraft: '',
                        inputState: flatPattern,
                        operator: 'or',
                      });
                    }}
                  >
                    <Badge
                      className='mx-1 my-1'
                      key={`key-filter-${idx}`}
                      type={getBadgeTypeFromLabel(label)}
                    >
                      {label}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className='flex w-full justify-end'>
              <Button
                onClick={() => {
                  setS3KeyInput({
                    operator: 'and',
                    inputState: [],
                    inputDraft: '',
                  });
                  setQueryParams({}, true);
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
                  });
                }}
                type='green'
              >
                Search
                {isSearchNeedUpdate && <CursorArrowRaysIcon className='h-5 w-5' />}
              </Button>
            </div>
            <div className='flex flex-row gap-6'>
              <Checkbox
                className='flex flex-row gap-2 text-sm font-medium'
                checked={isHidePrefix}
                onChange={() => setIsHidePrefix((p) => !p)}
                label='Hide S3 key prefix'
              />
            </div>
            <FileAPITable
              additionalQueryParam={{
                'attributes[portalRunId]': portalRunId,
                [`key[${searchKeyOpParam ?? DEFAULT_FILTER_OP}][]`]: searchKey ? searchKey : '*',
              }}
              tableColumn={getTableColumn({ isHideKeyPrefix: isHidePrefix })}
              isUmccriseWorkflowType={workflowType === 'umccrise'}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
