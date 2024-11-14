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
            workflowName: workflowRunDetail.workflow.workflowName,
            portalRunId: workflowRunDetail.portalRunId,
            executionId: workflowRunDetail.executionId || '-',
            excutionEngine: workflowRunDetail.workflow.executionEngine,
            workflowType:
              workflowRunDetail.workflow.workflowName +
              '  v' +
              workflowRunDetail.workflow.workflowVersion,
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
      },
      {
        header: 'Orcabus ID',
        accessor: 'orcabusId',
        cell: (orcabusId: unknown) => {
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${orcabusId}`}
                className={classNames('text-sm font-medium hover:text-blue-700 text-blue-500')}
              >
                <div>{orcabusId as string}</div>
              </Link>
            );
          }
        },
      },
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
