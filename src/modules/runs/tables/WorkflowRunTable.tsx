import { FC, useState, useEffect } from 'react';
import { Table, Column, TableData } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';

import { WORKFLOW_RUN_PAGE_SIZE_OPTIONS } from '@/utils/constant';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';

interface PaginationProps {
  count?: number;
  page?: number;
  rowsPerPage?: number;
}

interface WorkflowRunTableProps {
  tableData: TableData[];
  pagination: PaginationProps;
  setQueryParams: (params: Record<string, string | number | boolean>) => void;
}

const WorkflowRunTable: FC<WorkflowRunTableProps> = ({ tableData, pagination, setQueryParams }) => {
  const [tablePagination, setTablePagination] = useState<PaginationProps>({
    count: 0,
    page: 1,
    rowsPerPage: 15,
  });
  const [workflowRunTableData, setWorkflowRunTableData] = useState<TableData[]>([]);

  useEffect(() => {
    setTablePagination(pagination);
    setWorkflowRunTableData(tableData);
  }, [pagination, tableData]);

  const sequenceRunColumn: Column[] = [
    {
      header: 'Workflow Run Name',
      accessor: 'workflowRunName',
      cell: (workflowRunName: unknown) => {
        if (!workflowRunName) {
          return <div>-</div>;
        } else {
          const workflowRunId = workflowRunTableData.find(
            (data) => data.workflowRunName === workflowRunName
          )?.id;
          return (
            // <Link
            //   to={`workflow/${workflowRunName}/details`}
            //   className={classNames(
            //     'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            //   )}
            // >
            //   {workflowRunName as string}
            // </Link>
            <div>
              <div
                // to={`sequence/${portalRunId}/details`}
                className={classNames(
                  'cursor-pointer flex flex-row items-center ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
                onClick={() =>
                  setQueryParams({ workflowRunId: workflowRunId as string, openDrawer: true })
                }
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
  ];

  return (
    <div>
      <Table
        columns={[...sequenceRunColumn]}
        tableData={workflowRunTableData}
        inCard={false}
        paginationProps={{
          totalCount: tablePagination.count ?? 0,
          rowsPerPage: tablePagination.rowsPerPage ?? 0,
          currentPage: tablePagination.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
          countUnit: 'workflow runs',
          pageSizeOptions: WORKFLOW_RUN_PAGE_SIZE_OPTIONS,
        }}
      />
    </div>
  );
};

export default WorkflowRunTable;
