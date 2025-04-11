import { useSequenceRunContext } from './SequenceRunContext';
import { useWorkflowRunListModel } from '@/api/workflow';
import { useMemo } from 'react';
import { Column, TableData, Table } from '@/components/tables';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { classNames } from '@/utils/commonUtils';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { useQueryParams } from '@/hooks/useQueryParams';

const SequenceRunWorkflowRuns = () => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const { sequenceRunDetail } = useSequenceRunContext();

  const libraryIds = sequenceRunDetail?.libraries;

  const { data: workflowRuns, isLoading: isLoadingWorkflowRuns } = useWorkflowRunListModel({
    params: {
      query: {
        libraries__libraryId: libraryIds,
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
        status: ['succeeded', 'failed', 'aborted', 'resolved', 'deprecated'].includes(
          getQueryParams().workflowRunStatus
        )
          ? getQueryParams().workflowRunStatus
          : undefined,
        is_ongoing: getQueryParams().workflowRunStatus == 'ongoing' || undefined,
        start_time: sequenceRunDetail?.endTime,
        end_time: dayjs(sequenceRunDetail?.endTime).add(2, 'days').toISOString(),
      },
    },
  });
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
                  'flex cursor-pointer flex-row items-center text-sm font-medium text-blue-500 hover:text-blue-700'
                )}
              >
                <div>{workflowRunName as string}</div>
              </Link>
            );
          }
        },
      },
      {
        header: 'Portal Run ID',
        accessor: 'portalRunId',
        copyable: true,
        cell: (portalRunId: unknown) => {
          if (!portalRunId) {
            return <div>-</div>;
          } else {
            return <div>{portalRunId as string}</div>;
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

  if (
    !libraryIds ||
    libraryIds.length === 0 ||
    !workflowRuns ||
    (workflowRuns.results.length === 0 && getQueryParams().workflowRunStatus === undefined)
  ) {
    return;
  }

  return (
    <div>
      <Table
        columns={[...workflowRunColumn]}
        tableData={workflowRuns?.results ?? []}
        inCard={true}
        isFetchingData={isLoadingWorkflowRuns}
        paginationProps={{
          totalCount: workflowRuns?.pagination?.count ?? 0,
          rowsPerPage: workflowRuns?.pagination?.rowsPerPage ?? DEFAULT_PAGE_SIZE,
          currentPage: workflowRuns?.pagination?.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
        }}
      />
    </div>
  );
};

export default SequenceRunWorkflowRuns;
