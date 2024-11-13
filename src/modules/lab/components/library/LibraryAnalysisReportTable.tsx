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

  return (
    <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
      <div className='font-bold py-3 text-lg'>Workflow Results</div>
      {libraryDetail.type === 'WGS' ? (
        <>
          <DetailedErrorBoundary errorTitle={`Unable to load 'umccrise' report files`}>
            <AnalysisTable
              libraryOrcabusId={libraryDetail.orcabusId}
              workflowType='umccrise'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['umccrise']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['umccrise']['getTableData']}
            />
          </DetailedErrorBoundary>
          <div className='py-4'></div>
          <DetailedErrorBoundary errorTitle={`Unable to load 'tumor-normal' report files`}>
            <AnalysisTable
              libraryOrcabusId={libraryDetail.orcabusId}
              workflowType='tumor-normal'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['tumor-normal']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['tumor-normal']['getTableData']}
            />
          </DetailedErrorBoundary>
        </>
      ) : libraryDetail.type === 'WTS' ? (
        <>
          <DetailedErrorBoundary errorTitle={`Unable to load 'wts' report files`}>
            <AnalysisTable
              libraryOrcabusId={libraryDetail.orcabusId}
              workflowType='wts'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['wts']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['wts']['getTableData']}
            />
          </DetailedErrorBoundary>
          <div className='py-4'></div>
          <DetailedErrorBoundary errorTitle={`Unable to load 'rnasum' report files`}>
            <AnalysisTable
              libraryOrcabusId={libraryDetail.orcabusId}
              workflowType='rnasum'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['rnasum']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['rnasum']['getTableData']}
            />
          </DetailedErrorBoundary>
        </>
      ) : libraryDetail.type === 'ctDNA' &&
        (libraryDetail.assay?.toLowerCase() === 'cttso' ||
          libraryDetail.assay?.toLowerCase() == 'cttsov2') ? (
        <DetailedErrorBoundary errorTitle={`Unable to load 'cttsov2' report files`}>
          <AnalysisTable
            libraryOrcabusId={libraryDetail.orcabusId}
            workflowType='cttsov2'
            keyPatterns={WORKFLOW_ANALYSIS_TABLE['cttsov2']['keyPatterns']}
            getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['cttsov2']['getTableData']}
          />
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
        // WFM-FIXME: Library Orcabus Prefix
        libraries__orcabusId:
          libraryOrcabusId.split('.').length > 1
            ? libraryOrcabusId.split('.')[1]
            : libraryOrcabusId.split('.')[0],
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
  const portalRunId = workflowRunResults[0].portalRunId;
  const [selectedPortalRunId, setSelectedPortalRunId] = useState(portalRunId);

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

  const tableData = filesApiData.results.map((item) => ({
    key: item.key,
    lastModifiedDate: item.lastModifiedDate,
    size: item.size,
    fileRecord: item,
  }));

  return (
    <>
      <GroupedTable
        tableHeader={
          <div className='flex flex-row justify-between items-center'>
            <div>{workflowType}</div>
            <Dropdown
              floatingLabel='Portal Run Id'
              value={portalRunId}
              items={workflowRunResults.map((i) => ({
                label: i.portalRunId,
                onClick: () => setSelectedPortalRunId(i.portalRunId),
              }))}
            />
          </div>
        }
        striped={false}
        columns={getTableColumn({ isHideKeyPrefix: true }) as Column[]}
        tableData={getTableDataFormat(tableData)}
      />
      {filesApiData.results.length > DEFAULT_NON_PAGINATE_PAGE_SIZE && (
        <div className='p-4 text-slate-400 text-xs italic'>
          {`*Only show ${DEFAULT_NON_PAGINATE_PAGE_SIZE} files per portalRunId.`}
        </div>
      )}
    </>
  );
};
