import { useMemo } from 'react';
import { Table, Column, TableData } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { keepPreviousData } from '@tanstack/react-query';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useWorkflowRunListModel } from '@/api/workflow';
import { Link } from 'react-router-dom';

const WorkflowRunTable = ({ libraryOrcabusId }: { libraryOrcabusId?: string }) => {
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
        workflow__orcabus_id: getQueryParams().workflowTypeId || undefined,
        status: ['succeeded', 'failed', 'aborted', 'resolved'].includes(
          getQueryParams().workflowRunStatus
        )
          ? getQueryParams().workflowRunStatus
          : undefined,
        is_ongoing: getQueryParams().workflowRunStatus == 'ongoing' || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
        libraries__orcabusId: libraryOrcabusId
          ? // WFM-FIXME: Library Orcabus Prefix
            libraryOrcabusId.split('.').length > 1
            ? libraryOrcabusId.split('.')[1]
            : libraryOrcabusId.split('.')[0]
          : undefined,
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

  const workflowRunColumn: Column[] = useMemo(
    () => [
      {
        header: 'Workflow Run Name',
        accessor: 'workflowRunName',
        cell: (workflowRunName: unknown, workflowRunRowData: TableData) => {
          const id = workflowRunRowData.orcabusId;
          if (!workflowRunName) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/runs/workflow/${id}`}
                className={classNames(
                  'cursor-pointer flex flex-row items-center text-sm font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                <div>{workflowRunName as string}</div>
              </Link>
            );
          }
        },
      },
      {
        header: 'Portal Run Id',
        accessor: 'portalRunId',
        copyable: true,
        onSort: () => {
          console.log('sorting');
        },
        sortDirection: 'asc',
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
    ],
    []
  );

  return (
    <div>
      <Table
        columns={[...workflowRunColumn]}
        tableData={workflowRunsData?.results ?? []}
        inCard={true}
        isFetchingData={isFetching}
        paginationProps={{
          totalCount: workflowRunsData?.pagination?.count ?? 0,
          rowsPerPage: workflowRunsData?.pagination?.rowsPerPage ?? DEFAULT_PAGE_SIZE,
          currentPage: workflowRunsData?.pagination?.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
          countUnit: 'workflow runs',
        }}
      />
    </div>
  );
};

export default WorkflowRunTable;
