import { useSequenceRunListModel, SequenceRunModel } from '@/api/sequenceRun';
import { Table, TableData } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { useState, ReactNode } from 'react';
// import { Link } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { dayjs } from '@/utils/dayjs';
// import { ClipboardIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/common/badges';
import SequenceRunDetailsDrawer from './SequenceRunDetailsDrawer';
const SequenceRunTable = () => {
  const [selectedSequenceRun, setSelectedSequenceRun] = useState<SequenceRunModel | null>(null);

  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const {
    data: sequenceRunsData,
    isError: isSequenceError,
    error: sequenceError,
    isFetching,
  } = useSequenceRunListModel({
    params: {
      query: {
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
        search: getQueryParams().search || undefined,
        status: getQueryParams().sequenceRunStatus || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
  });

  if (isSequenceError) {
    throw sequenceError;
  }

  const onCloseDrawer = () => {
    setSelectedSequenceRun(null);
    setQueryParams({ sequenceRunId: null });
  };

  const sequenceRunColumn: Column[] = [
    {
      header: 'Instrument Run Id',
      accessor: 'instrumentRunId',
      cell: (instrumentRunId: unknown, sequenceRunRowData: TableData) => {
        if (!instrumentRunId) {
          return <div>-</div>;
        } else {
          return (
            <div>
              <div
                className={classNames(
                  'ml-2 flex cursor-pointer flex-row items-center text-sm font-medium uppercase text-blue-500 hover:text-blue-700'
                )}
                onClick={() => {
                  setSelectedSequenceRun(sequenceRunRowData as SequenceRunModel);
                  setQueryParams({ sequenceRunId: sequenceRunRowData.orcabusId });
                }}
              >
                {instrumentRunId as string}
              </div>
            </div>
          );
        }
      },
    },
    {
      header: 'Sequencing',
      accessor: 'status',
      cell: (status: unknown) => {
        return (
          <Badge status={(status as string) || 'UNKNOWN'}>
            {(status || 'UNKNOWN') as ReactNode}
          </Badge>
        );
      },
    },
    {
      header: 'Start Time',
      accessor: 'startTime',
      cell: (startTime: unknown) => {
        if (!startTime) {
          return <div>-</div>;
        } else {
          return <div>{dayjs(startTime as string).format('YYYY-MM-DD HH:mm:ss')}</div>;
        }
      },
    },
    {
      header: 'End Time',
      accessor: 'endTime',
      cell: (endTime: unknown) => {
        if (!endTime) {
          return <div>-</div>;
        } else {
          return <div>{dayjs(endTime as string).format('YYYY-MM-DD HH:mm:ss')}</div>;
        }
      },
    },
    // {
    //   header: 'Bcl Convert',
    //   accessor: 'bclConvertStatus',
    //   cell: (status: unknown) => {
    //     return (
    //       <Badge status={(status as string) || 'UNKNOWN'}>
    //         {(status || 'UNKNOWN') as ReactNode}
    //       </Badge>
    //     );
    //   },
    // },
    // {
    //   header: '',
    //   accessor: 'instrumentRunId',
    //   cell: (instrumentRunId: unknown) => {
    //     if (!instrumentRunId) {
    //       return <div>-</div>;
    //     } else {
    //       return (
    //         <div className='flex flex-row items-center'>
    //           {/* <Link
    //             to={`sequence/${instrumentRunId}/details`}
    //             className={classNames(
    //               'flex flex-row items-center text-sm font-medium hover:text-blue-700 text-blue-500'
    //             )}
    //           >
    //             <TableCellsIcon
    //               className='h-5 w-5 pr-1 shrink-0 text-blue-500'
    //               aria-hidden='true'
    //             />
    //             Details
    //           </Link> */}
    //           {/* <Link
    //           to={`sequence/${instrumentRunId}/diagram`}
    //           className={classNames(
    //             'flex flex-row items-center text-sm font-medium hover:text-blue-700 text-blue-500'
    //           )}
    //         >
    //           <RectangleGroupIcon
    //             className='h-5 w-5 pr-1 shrink-0 text-blue-500'
    //             aria-hidden='true'
    //           />
    //           Diagram
    //         </Link> */}
    //           <Link
    //             to={`sequence/${instrumentRunId}/report`}
    //             className={classNames(
    //               'flex flex-row items-center text-sm font-medium hover:text-blue-700 text-blue-500'
    //             )}
    //           >
    //             <ClipboardIcon className='h-5 w-5 pr-1 shrink-0 text-blue-500' aria-hidden='true' />
    //             Report
    //           </Link>
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
        tableData={sequenceRunsData?.results ?? []}
        inCard={true}
        isFetchingData={isFetching}
        paginationProps={{
          totalCount: sequenceRunsData?.pagination.count ?? 0,
          rowsPerPage: sequenceRunsData?.pagination.rowsPerPage ?? DEFAULT_PAGE_SIZE,
          currentPage: sequenceRunsData?.pagination.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
          countUnit: 'runs',
        }}
      />

      {(getQueryParams().sequenceRunId || selectedSequenceRun) && (
        <SequenceRunDetailsDrawer
          selectedSequenceRunId={getQueryParams().sequenceRunId}
          onCloseDrawer={onCloseDrawer}
        />
      )}
    </div>
  );
};

export default SequenceRunTable;
