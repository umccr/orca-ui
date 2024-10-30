import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWorkflowRunDetailModel } from '@/api/workflow';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';

const WorkflowRunDetailsTable = () => {
  const { orcabusId } = useParams();

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { orcabusId: orcabusId as string } },
      reactQuery: {
        enabled: !!orcabusId,
      },
    });

  // format data and disply in the table
  const detailsData = useMemo(
    () =>
      workflowRunDetail
        ? {
            portalRunId: workflowRunDetail.portalRunId,
            executionId: workflowRunDetail.executionId || '-',
            workflowType:
              workflowRunDetail.workflow.workflowName +
              ' v' +
              workflowRunDetail.workflow.workflowVersion,
            excutionEngine: workflowRunDetail.workflow.executionEngine,
            currentState: (workflowRunDetail.currentState.status as string) || '-',
            timestamp: (workflowRunDetail.currentState.timestamp as string) || '-',
            comments: workflowRunDetail.comment || '-',
          }
        : null,
    [workflowRunDetail]
  );

  const librariesTableData = useMemo(
    () =>
      workflowRunDetail && workflowRunDetail.libraries.length > 0
        ? workflowRunDetail.libraries.map((library) => ({
            libraryId: library.libraryId,
            orcabusId: library.orcabusId,
          }))
        : [],
    [workflowRunDetail]
  );

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
    <div className='pt-4 w-full flex flex-row gap-2'>
      <div className='flex-1'>
        <JsonToList
          // title='Details'
          data={detailsData}
          isFetchingData={isFetchingWorkflowRunDetail}
        />
      </div>
      <div className='flex-1'>
        <Table
          // tableHeader='Libraries'
          inCard={true}
          columns={librariesTableColumns}
          tableData={librariesTableData}
          isFetchingData={isFetchingWorkflowRunDetail}
        />
      </div>
    </div>
  );
};

export default WorkflowRunDetailsTable;
