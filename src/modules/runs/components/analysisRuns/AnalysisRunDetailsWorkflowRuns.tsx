import { Column, Table, TableData } from '@/components/tables';
import { useParams } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/common/badges';
import { useWorkflowRunListModel } from '@/api/workflow';

const AnalysisRunDetailsWorkflowRuns = () => {
  const { orcabusId } = useParams();
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();
  const { data: workflowRuns, isFetching: isFetchingWorkflowRuns } = useWorkflowRunListModel({
    params: {
      query: {
        analysisRun__orcabus_id: orcabusId as string,
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
      },
    },
    reactQuery: {
      enabled: !!orcabusId,
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
              <div>
                <div
                  className={classNames(
                    'ml-2 flex cursor-pointer flex-row items-center text-sm font-medium text-blue-500 lowercase hover:text-blue-700'
                  )}
                  // onClick={() => {
                  //   setSelectedWorkflowRun(workflowRunRowData as WorkflowRunModel);
                  //   setQueryParams({ workflowRunId: workflowRunRowData.id });
                  // }}
                >
                  <Link
                    to={`${id}`}
                    className={classNames(
                      'ml-2 flex cursor-pointer flex-row items-center text-sm font-medium text-blue-500 capitalize hover:text-blue-700'
                    )}
                  >
                    {(workflowRunName as string).toLocaleLowerCase()}
                  </Link>
                </div>
              </div>
            );
          }
        },
      },
      {
        header: 'Portal Run ID',
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
        tableData={workflowRuns?.results ?? []}
        inCard={true}
        isFetchingData={isFetchingWorkflowRuns}
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
          countUnit: 'workflow runs',
        }}
      />
    </div>
  );
};

export default AnalysisRunDetailsWorkflowRuns;
