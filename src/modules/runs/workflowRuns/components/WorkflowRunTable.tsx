import { useState, useMemo } from 'react';
import { Table, Column, TableData } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { keepPreviousData } from '@tanstack/react-query';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
import { WorkflowRunDetailsDrawer } from './WorkflowRunDetailsDrawer';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useWorkflowRunListModel, WorkflowRunModel } from '@/api/workflow';

const WorkflowRunTable = () => {
  const [selectedWorkflowRun, setSelectedWorkflowRun] = useState<WorkflowRunModel | null>(null);

  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  // Api call to get workflow runs
  const {
    data: workflowRunsData,
    error,
    isError,
    isFetching,
  } = useWorkflowRunListModel({
    params: {
      query: {
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
        search: getQueryParams().search || undefined,
        workflow__id: getQueryParams().workflowTypeId || undefined,
        status: ['succeeded', 'failed', 'aborted'].includes(getQueryParams().workflowRunStatus)
          ? getQueryParams().workflowRunStatus
          : undefined,
        is_ongoing: getQueryParams().workflowRunStatus == 'ongoing' || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
    reactQuery: {
      enabled: true,
      placeholderData: keepPreviousData,
    },
  });

  if (isError) {
    throw error;
  }

  const onCloseDrawer = () => {
    setSelectedWorkflowRun(null);
    setQueryParams({ workflowRunId: null });
  };
  const workflowRunColumn: Column[] = useMemo(
    () => [
      {
        header: 'Workflow Run Name',
        accessor: 'workflowRunName',
        cell: (workflowRunName: unknown, workflowRunRowData: TableData) => {
          if (!workflowRunName) {
            return <div>-</div>;
          } else {
            return (
              <div>
                <div
                  className={classNames(
                    'cursor-pointer flex flex-row items-center ml-2 text-sm lowercase font-medium hover:text-blue-700 text-blue-500'
                  )}
                  onClick={() => {
                    setSelectedWorkflowRun(workflowRunRowData as WorkflowRunModel);
                    setQueryParams({ workflowRunId: workflowRunRowData.id });
                  }}
                >
                  {(workflowRunName as string).toLocaleLowerCase()}
                </div>
              </div>
            );
          }
        },
      },
      {
        header: 'Portal Run Id',
        accessor: 'portalRunId',
        cell: (portalRunId: unknown) => {
          if (!portalRunId) {
            return <div>-</div>;
          } else {
            return <div>{portalRunId as string}</div>;
          }
        },
      },
      {
        header: 'Workflow Type',
        accessor: 'workflow',
        cell: (workflow: unknown) => {
          if (!workflow) {
            return <div>-</div>;
          } else {
            return <div>{(workflow as { workflowName: string }).workflowName}</div>;
          }
        },
      },
      {
        header: 'Workflow Version',
        accessor: 'workflow',
        cell: (workflow: unknown) => {
          if (!workflow) {
            return <div>-</div>;
          } else {
            return <div>{(workflow as { workflowVersion: string }).workflowVersion}</div>;
          }
        },
      },

      {
        header: 'Status',
        accessor: 'currentState',
        cell: (currentState: unknown) => {
          const status = (currentState as { status: string }).status;
          return <Badge status={status || 'unknown'}>{status || 'unknown'}</Badge>;
        },
      },
      {
        header: 'Time Stamp',
        accessor: 'currentState',
        cell: (currentState: unknown) => {
          const timestamp = (currentState as { timestamp: string }).timestamp;
          if (!timestamp) {
            return <div>-</div>;
          } else {
            return <div>{dayjs(timestamp as string).format('YYYY-MM-DD')}</div>;
          }
        },
      },
      // {
      //   header: '',
      //   accessor: 'id',
      //   cell: (id: unknown) => {
      //     if (!id) {
      //       return <div>-</div>;
      //     } else {
      //       return (
      //         <div className='flex flex-row items-center'>
      //           <div
      //             // to={`sequence/${portalRunId}/details`}
      //             className={classNames(
      //               'cursor-pointer flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
      //             )}
      //             onClick={() => setQueryParams({ workflowRunId: id as string, openDrawer: true })}
      //           >
      //             <TableCellsIcon
      //               className='h-5 w-5 pr-1 shrink-0 text-blue-500'
      //               aria-hidden='true'
      //             />
      //             Details
      //           </div>
      //         </div>
      //       );
      //     }
      //   },
      // },
    ],
    [setQueryParams]
  );

  return (
    <div>
      <Table
        columns={[...workflowRunColumn]}
        tableData={workflowRunsData?.results ?? []}
        inCard={true}
        isFetchingData={isFetching}
        paginationProps={{
          totalCount: workflowRunsData?.pagination.count ?? 0,
          rowsPerPage: workflowRunsData?.pagination.rowsPerPage ?? DEFAULT_PAGE_SIZE,
          currentPage: workflowRunsData?.pagination.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
          countUnit: 'workflow runs',
        }}
      />
      {(getQueryParams().workflowRunId || selectedWorkflowRun) && (
        <WorkflowRunDetailsDrawer
          selectedWorkflowRunData={selectedWorkflowRun}
          selectedWorkflowRunId={getQueryParams().workflowRunId}
          onCloseDrawer={onCloseDrawer}
        />
      )}
    </div>
  );
};

export default WorkflowRunTable;
