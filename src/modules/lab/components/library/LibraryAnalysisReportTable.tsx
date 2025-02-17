import { components } from '@/api/types/metadata';
import { FC, Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { useState } from 'react';
import { getTableColumn } from '@/modules/files/components/FileAPITable';
import { useSuspenseWorkflowRunListModel } from '@/api/workflow';
import { useSuspenseFileObject } from '@/api/file';
import { GroupedTable } from '@/components/tables';
import { Column, TableData } from '@/components/tables/GroupedRowTable';
import { Dropdown } from '@/components/common/dropdowns';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { SpinnerWithText } from '@/components/common/spinner';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/common/badges';
import { Tooltip } from '@/components/common/tooltips';
import { JsonToTable } from '@/components/common/json-to-table';
import { WorkflowDialogDetail } from './WorkflowDialogDetail';

const WORKFLOW_ANALYSIS_TABLE = {
  umccrise: {
    keyPatterns: ['*.html', '*circos*.png', '*somatic-PASS.vcf.gz', '*predispose_genes.vcf.gz'],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'CANCER',
          groupData: data.filter((r) => r.key.endsWith('cancer_report.html')),
        },
        {
          groupTitle: 'PCGR',
          groupData: data.filter((r) => r.key.endsWith('pcgr.html')),
        },
        {
          groupTitle: 'CPSR',
          groupData: data.filter((r) => r.key.endsWith('cpsr.html')),
        },
        {
          groupTitle: 'MULTIQC',
          groupData: data.filter((r) => r.key.includes('multiqc')),
        },
        {
          groupTitle: 'CIRCOS',
          groupData: data.filter((r) => r.key.endsWith('.png')),
        },
        {
          groupTitle: 'VCF',
          groupData: data.filter((r) => r.key.endsWith('.vcf.gz')),
        },
      ];
    },
  },
  'tumor-normal': {
    keyPatterns: ['*.bam'],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'BAM',
          groupData: data.filter((r) => r.key.endsWith('.bam')),
        },
      ];
    },
  },
  wts: {
    keyPatterns: ['*multiqc*.html', '*fusions*.pdf', '*.bam'],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'MULTIQC',
          groupData: data.filter((r) => r.key.includes('multiqc')),
        },
        {
          groupTitle: 'FUSIONS',
          groupData: data.filter((r) => r.key.includes('fusions')),
        },
        {
          groupTitle: 'BAM',
          groupData: data.filter((r) => r.key.endsWith('.bam')),
        },
      ];
    },
  },
  rnasum: {
    keyPatterns: ['*RNAseq_report.html', '*/genes.expr.perc.html', '*/genes.expr.z.html'],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'HTML',
          groupData: data.filter((r) => r.key.endsWith('.html')),
        },
      ];
    },
  },
  cttsov2: {
    keyPatterns: [
      '*.bam',
      '*.tmb.msaf.csv',
      '*/Results/*/*.csv',
      '*/Results/*/*.tsv',
      '*/Results/*.vcf.gz',
      '*/Results/*.gvcf.gz',
    ],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'CSV',
          groupData: data.filter((r) => r.key.endsWith('.csv')),
        },
        {
          groupTitle: 'TSV',
          groupData: data.filter((r) => r.key.endsWith('.tsv')),
        },
        {
          groupTitle: 'JSON',
          groupData: data.filter((r) => r.key.endsWith('.json')),
        },
        {
          groupTitle: 'VCF',
          groupData: data.filter((r) => r.key.endsWith('.vcf.gz')),
        },
        {
          groupTitle: 'BAM',
          groupData: data.filter((r) => r.key.endsWith('.bam')),
        },
      ];
    },
  },
};

type LibraryAnalysisReportTableProps = { libraryDetail: components['schemas']['LibraryDetail'] };

export const LibraryAnalysisReportTable: FC<LibraryAnalysisReportTableProps> = ({
  libraryDetail,
}) => {
  /**
   * FIX ME
   *
   * This temporarily show the expected reports from each library type (as existing data-portal)
   * Ideally this could be viewable in a case-view to show relevant reports
   *
   * Notes:
   * WGS library type => "UMCCRISE" && "tumor-normal" workflow type html reports
   * WTS library type => "wts" && "rnasum" workflow type pdf/html reports
   * ctDNA library type && "ctTSO" assay => "cttsov2" workflow pdf/html reports
   */

  const libraryDisplayNotes = {
    '"WGS" type': ['UMCCRISE', 'tumor-normal'],
    '"WTS" type': ['wts', 'rnasum'],
    '"ctDNA" type, "ctTSO" assay': ['cttsov2'],
  };

  return (
    <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
      <div className='mb-3 flex flex-row items-center py-3'>
        <div className='text-lg font-bold'>Overview Highlights</div>
        <Tooltip
          text={
            <div>
              <h1 className='font-bold'>What runs to expect here?</h1>
              <JsonToTable data={libraryDisplayNotes} className='shadow-none' />
            </div>
          }
          position='bottom'
          background='light'
          size='large'
          className='w-96'
        >
          <InformationCircleIcon className='2-5 mx-2 h-5' />
        </Tooltip>
      </div>
      {libraryDetail.type === 'WGS' ? (
        <>
          <DetailedErrorBoundary errorTitle={`Unable to load 'umccrise' report files`}>
            <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
              <AnalysisTable
                libraryOrcabusId={libraryDetail.orcabusId}
                workflowType='umccrise'
                keyPatterns={WORKFLOW_ANALYSIS_TABLE['umccrise']['keyPatterns']}
                getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['umccrise']['getTableData']}
              />
            </Suspense>
          </DetailedErrorBoundary>
          <div className='py-4'></div>
          <DetailedErrorBoundary errorTitle={`Unable to load 'tumor-normal' report files`}>
            <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
              <AnalysisTable
                libraryOrcabusId={libraryDetail.orcabusId}
                workflowType='tumor-normal'
                keyPatterns={WORKFLOW_ANALYSIS_TABLE['tumor-normal']['keyPatterns']}
                getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['tumor-normal']['getTableData']}
              />
            </Suspense>
          </DetailedErrorBoundary>
        </>
      ) : libraryDetail.type === 'WTS' ? (
        <>
          <DetailedErrorBoundary errorTitle={`Unable to load 'wts' report files`}>
            <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
              <AnalysisTable
                libraryOrcabusId={libraryDetail.orcabusId}
                workflowType='wts'
                keyPatterns={WORKFLOW_ANALYSIS_TABLE['wts']['keyPatterns']}
                getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['wts']['getTableData']}
              />
            </Suspense>
          </DetailedErrorBoundary>
          <div className='py-4'></div>
          <DetailedErrorBoundary errorTitle={`Unable to load 'rnasum' report files`}>
            <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
              <AnalysisTable
                libraryOrcabusId={libraryDetail.orcabusId}
                workflowType='rnasum'
                keyPatterns={WORKFLOW_ANALYSIS_TABLE['rnasum']['keyPatterns']}
                getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['rnasum']['getTableData']}
              />
            </Suspense>
          </DetailedErrorBoundary>
        </>
      ) : libraryDetail.type === 'ctDNA' &&
        (libraryDetail.assay?.toLowerCase() === 'cttso' ||
          libraryDetail.assay?.toLowerCase() == 'cttsov2') ? (
        <DetailedErrorBoundary errorTitle={`Unable to load 'cttsov2' report files`}>
          <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
            <AnalysisTable
              libraryOrcabusId={libraryDetail.orcabusId}
              workflowType='cttsov2'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['cttsov2']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['cttsov2']['getTableData']}
            />
          </Suspense>
        </DetailedErrorBoundary>
      ) : (
        <pre>No file highlights available for this library</pre>
      )}
    </Suspense>
  );
};

export const AnalysisTable = ({
  libraryOrcabusId,
  workflowType,
  keyPatterns,
  getTableDataFormat,
}: {
  libraryOrcabusId: string;
  workflowType: string;
  keyPatterns: string[];
  getTableDataFormat: (data: ({ key: string } & Record<string, unknown>)[]) => TableData[];
}) => {
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
  if (!workflowRunResults || workflowRunResults.length <= 0) {
    throw new Error(`No '${workflowType}' run found!`);
  }
  const initPortalRunId = workflowRunResults[0].portalRunId;
  const [selectedPortalRunId, setSelectedPortalRunId] = useState(initPortalRunId);

  const filesApiData = useSuspenseFileObject({
    params: {
      query: {
        'key[]': keyPatterns,
        rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE,
        currentState: true,
        'attributes[portalRunId]': selectedPortalRunId,
      },
    },
  }).data;

  if (!filesApiData?.results) {
    throw new Error('No report found!');
  }

  /**
   * FIX ME
   * Filter out files that are not intended for output (e.g., files under the 'work/' folder)
   * and map the remaining files to the desired table data format.
   * Ideally, if the file manager API supports regex, we should switch to that approach.
   */
  const tableData = filesApiData.results
    .filter(({ key }) => !key.includes('/work/'))
    .map((item) => ({
      key: item.key,
      lastModifiedDate: item.lastModifiedDate,
      size: item.size,
      fileRecord: item,
    }));

  const isMultipleRuns = workflowRunResults.length > 1;
  const currentSelectedWorkflowDetail = workflowRunResults.find(
    (w) => w.portalRunId === selectedPortalRunId
  );
  if (!currentSelectedWorkflowDetail) {
    throw new Error('No workflow detail found!');
  }

  return (
    <>
      <GroupedTable
        tableHeader={
          <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row'>
                <div>{workflowType}</div>
                <WorkflowDialogDetail
                  portalRunId={selectedPortalRunId}
                  workflowDetail={currentSelectedWorkflowDetail}
                />
              </div>
              {isMultipleRuns && (
                <div className='flex flex-row'>
                  <Badge type='warning' className='mr-2'>
                    <ExclamationTriangleIcon className='mr-2 h-5 w-5' />
                    <p className='mt-0.5'>Multiple runs</p>
                  </Badge>
                  <Dropdown
                    floatingLabel='Portal Run ID'
                    value={selectedPortalRunId}
                    items={workflowRunResults.map((i) => ({
                      label: i.portalRunId,
                      onClick: () => setSelectedPortalRunId(i.portalRunId),
                    }))}
                  />
                </div>
              )}
            </div>
            {filesApiData.links?.next && (
              <div className='pt-4 text-xs italic text-slate-400'>
                *Due to pagination, some files may not be shown here.
              </div>
            )}
          </div>
        }
        striped={false}
        columns={getTableColumn({ isHideKeyPrefix: true }) as Column[]}
        tableData={getTableDataFormat(tableData)}
      />
    </>
  );
};
