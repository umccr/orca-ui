import { useAnalysisRunDetailModel, useWorkflowRunListModel } from '@/api/workflow';
import { useParams } from 'react-router-dom';
import { JsonToList } from '@/components/common/json-to-table';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { useMemo } from 'react';
import { Table, TableData, Column } from '@/components/tables';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Badge } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';

const AnalysisRunDetailsTable = () => {
  const { orcabusId } = useParams();
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const { data: analysisRun, isFetching: isFetchingAnalysisRun } = useAnalysisRunDetailModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const { data: workflowRuns, isFetching: isFetchingWorkflowRuns } = useWorkflowRunListModel({
    params: {
      query: {
        analysisRun__orcabus_id: orcabusId?.split('.')[1] as string,
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
      },
    },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const computeContext = analysisRun?.computeContext ?? {};
  const storageContext = analysisRun?.storageContext ?? {};
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
                    'cursor-pointer flex flex-row items-center ml-2 text-sm lowercase font-medium hover:text-blue-700 text-blue-500'
                  )}
                  // onClick={() => {
                  //   setSelectedWorkflowRun(workflowRunRowData as WorkflowRunModel);
                  //   setQueryParams({ workflowRunId: workflowRunRowData.id });
                  // }}
                >
                  <Link
                    to={`${id}`}
                    className={classNames(
                      'cursor-pointer flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
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
      // {
      //   header: '',
      //   accessor: 'id',
      //   cell: (id: unknown) => {
      //     if (!id) {
      //       return <div>-</div>;
      //     } else {
      //       return (
      //         <div className='flex flex-row items-center'>
      //           <Link
      //             to={`workflow/${id}`}
      //             className={classNames(
      //               'cursor-pointer flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
      //             )}
      //           >
      //             <TableCellsIcon
      //               className='h-5 w-5 pr-1 shrink-0 text-blue-500'
      //               aria-hidden='true'
      //             />
      //             Details
      //           </Link>
      //         </div>
      //       );
      //     }
      //   },
      // },
    ],
    []
  );

  return (
    <div>
      <div className='pt-4 w-full flex flex-row gap-2'>
        <div className='flex-1'>
          <JsonToList data={computeContext || {}} isFetchingData={isFetchingAnalysisRun} />
        </div>
        <div className='flex-1'>
          <JsonToList data={storageContext || {}} isFetchingData={isFetchingAnalysisRun} />
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
    </div>
  );
};

export default AnalysisRunDetailsTable;
