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
  tumor_normal: {
    keyPatterns: ['*.bam'],
    getTableData: (data: ({ key: string } & Record<string, unknown>)[]): TableData[] => {
      return [
        {
          groupTitle: 'bam',
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
      '*/Results/*/*.csv',
      '*/Results/*/*.tsv',
      '*/Results/*.vcf.gz',
      '*/Results/*.gvcf.gz',
      '*/Results/*.tmb.msaf.csv',
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
  const libraryId = libraryDetail.libraryId;
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  /**
   * FIX ME
   *
   * This temporarily show the expected reports from each library type (as existing data-portal)
   * Ideally this could be viewable in a case-view to show relevant reports
   *
   * Notes:
   * WGS library type => "UMCCRISE" && "tumor_normal" workflow type html reports
   * WTS library type => "wts" && "rnasum" workflow type pdf/html reports
   * ctDNA library type && "ctTSO" assay => "cttsov2" workflow pdf/html reports
   */

  return (
    <DetailedErrorBoundary errorTitle='Unable to load analysis report files'>
      <Suspense fallback={<SpinnerWithText text='loading data ...' />}>
        <div className='font-bold py-3 text-lg'>Workflow Results</div>
        {libraryDetail.type === 'WGS' ? (
          <>
            <AnalysisTable
              libraryId={libraryId}
              workflowType='umccrise'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['umccrise']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['umccrise']['getTableData']}
            />
            <AnalysisTable
              libraryId={libraryId}
              workflowType='tumor_normal'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['umccrise']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['umccrise']['getTableData']}
            />
          </>
        ) : libraryDetail.type === 'WTS' ? (
          <>
            <AnalysisTable
              libraryId={libraryId}
              workflowType='wts'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['wts']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['wts']['getTableData']}
            />
            <div className='py-4'></div>
            <AnalysisTable
              libraryId={libraryId}
              workflowType='rnasum'
              keyPatterns={WORKFLOW_ANALYSIS_TABLE['rnasum']['keyPatterns']}
              getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['rnasum']['getTableData']}
            />
          </>
        ) : libraryDetail.type === 'ctDNA' && libraryDetail.assay === 'ctTSO' ? (
          <AnalysisTable
            libraryId={libraryId}
            workflowType='cttsov2'
            keyPatterns={WORKFLOW_ANALYSIS_TABLE['cttsov2']['keyPatterns']}
            getTableDataFormat={WORKFLOW_ANALYSIS_TABLE['cttsov2']['getTableData']}
          />
        ) : (
          <pre>No file highlights available for this library</pre>
        )}
      </Suspense>
    </DetailedErrorBoundary>
  );
};

export const AnalysisTable = ({
  libraryId,
  workflowType,
  keyPatterns,
  getTableDataFormat,
}: {
  libraryId: string;
  workflowType: string;
  keyPatterns: string[];
  getTableDataFormat: (data: ({ key: string } & Record<string, unknown>)[]) => TableData[];
}) => {
  const workflowRun = useSuspenseWorkflowRunListModel({
    params: {
      query: {
        libraries__libraryId: libraryId,
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
