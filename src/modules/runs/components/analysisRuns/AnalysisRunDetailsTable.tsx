import { useAnalysisRunDetailModel } from '@/api/workflow';
import { useParams } from 'react-router-dom';
import { JsonToNestedList } from '@/components/common/json-to-table';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { useMemo } from 'react';
import { Table, TableData } from '@/components/tables';
import { omit } from '@/utils/commonUtils';
const AnalysisRunDetailsTable = () => {
  const { orcabusId } = useParams();

  const { data: analysisRun, isFetching: isFetchingAnalysisRun } = useAnalysisRunDetailModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const analysisRunDetail = useMemo(
    () =>
      analysisRun
        ? {
            currentStatus: analysisRun?.status,
            comment: analysisRun?.comment,
            analysis: {
              analysisName: analysisRun?.analysis?.analysisName,
              analysisVersion: analysisRun?.analysis?.analysisVersion,
              analysisStatus: analysisRun?.analysis?.status,
              workflows: analysisRun?.analysis?.workflows.map((workflow) => ({
                name: workflow.workflowName,
                version: workflow.workflowVersion,
              })),
              contexts: analysisRun?.analysis?.contexts.map((context) => ({
                name: context.name,
                usecase: context.usecase,
                description: context.description,
                status: context.status,
              })),
            },
            computeContext: omit(analysisRun?.computeContext, ['orcabusId']),
            storageContext: omit(analysisRun?.storageContext, ['orcabusId']),
          }
        : null,
    [analysisRun]
  );
  const libraries = analysisRun?.libraries ?? [];
  const librariesTableColumns = useMemo(
    () => [
      {
        header: 'Library ID',
        accessor: 'libraryId',
        cell: (libraryId: unknown) => {
          if (!libraryId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${libraryId}`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {libraryId as string}
              </Link>
            );
          }
        },
      },
      { header: 'Orcabus ID', accessor: 'orcabusId' },
    ],
    []
  );

  return (
    <div>
      <div className='pt-4 w-full flex flex-row gap-2'>
        <div className='flex-2'>
          {/* <div className='text-sm font-medium'>Compute Context</div> */}
          <JsonToNestedList data={analysisRunDetail || {}} isFetchingData={isFetchingAnalysisRun} />
        </div>

        <div className='flex-1'>
          <Table
            // tableHeader='Libraries'
            inCard={true}
            columns={librariesTableColumns}
            tableData={libraries as TableData[]}
            isFetchingData={isFetchingAnalysisRun}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisRunDetailsTable;
