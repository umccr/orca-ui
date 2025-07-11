import { useSequenceRunListModel } from '@/api/sequenceRun';
import { Table, TableData } from '@/components/tables';
import { Column, getCurrentSortDirection } from '@/components/tables/Table';
import { ReactNode } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
// import SequenceRunDetailsDrawer from './SequenceRunDetailsDrawer';
import { MultiqcIcon } from '@/components/icons/MultiqcIcon';
import { Tooltip } from '@/components/common/tooltips';
import { RedirectLink } from '@/components/common/link';
import { TableCellsIcon } from '@heroicons/react/24/outline';
// import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
const SequenceRunTable = () => {
  // const [selectedSequenceRun, setSelectedSequenceRun] = useState<SequenceRunModel | null>(null);

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
        ordering: getQueryParams().ordering || '-start_time',
      },
    },
  });

  if (isSequenceError) {
    throw sequenceError;
  }

  // const onCloseDrawer = () => {
  //   setSelectedSequenceRun(null);
  //   setQueryParams({ sequenceRunId: null });
  // };

  const sequenceRunColumn: Column[] = [
    {
      header: 'Instrument Run ID',
      accessor: 'instrumentRunId',
      onSort: () => {
        if (getQueryParams().ordering === 'instrument_run_id') {
          setQueryParams({ ordering: '-instrument_run_id' });
        } else {
          setQueryParams({ ordering: 'instrument_run_id' });
        }
      },
      sortDirection: getCurrentSortDirection(getQueryParams().ordering, 'instrument_run_id'),
      cell: (instrumentRunId: unknown, sequenceRunRowData: TableData) => {
        const id = sequenceRunRowData.orcabusId;
        return (
          <RedirectLink to={`/runs/sequence/${id}`} className='flex items-center p-1'>
            <div>{instrumentRunId ? (instrumentRunId as string) : '-'}</div>
          </RedirectLink>
        );
      },
    },
    {
      header: 'Experiment Name',
      accessor: 'experimentName',
      cell: (experimentName: unknown) => {
        return <div>{experimentName ? (experimentName as string) : '-'}</div>;
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
      onSort: () => {
        if (getQueryParams().ordering === 'start_time') {
          setQueryParams({ ordering: '-start_time' });
        } else {
          setQueryParams({ ordering: 'start_time' });
        }
      },
      sortDirection: getCurrentSortDirection(getQueryParams().ordering, 'start_time'),
      cell: (startTime: unknown) => {
        if (!startTime) {
          return <div>-</div>;
        } else {
          return <div>{startTime ? dayjs(startTime as string).format('lll') : '-'}</div>;
          return <div>{startTime ? dayjs(startTime as string).format('lll') : '-'}</div>;
        }
      },
    },
    {
      header: 'End Time',
      accessor: 'endTime',
      onSort: () => {
        if (getQueryParams().ordering === 'end_time') {
          setQueryParams({ ordering: '-end_time' });
        } else {
          setQueryParams({ ordering: 'end_time' });
        }
      },
      sortDirection: getCurrentSortDirection(getQueryParams().ordering, 'end_time'),
      cell: (endTime: unknown) => {
        if (!endTime) {
          return <div>-</div>;
        } else {
          return <div>{endTime ? dayjs(endTime as string).format('lll') : '-'}</div>;
        }
      },
    },
    {
      header: '',
      accessor: 'instrumentRunId',
      cell: (instrumentRunId: unknown) => {
        // Encode the URL parameters properly
        const filesParams = new URLSearchParams([
          ['key', `*${instrumentRunId}_multiqc_report.html`],
          ['key', `*${instrumentRunId}_*_qlims.csv`],
          ['keyOp', 'or'],
          ['bucketOp', 'or'],
        ]);

        const vaultParams = new URLSearchParams({
          filter: JSON.stringify({
            and: [{ sequencingRunId: { equalTo: instrumentRunId } }],
          }),
        });

        return (
          <div className='flex flex-row gap-2'>
            {/* <Tooltip text='Comment' size='small' background='light'>
              <div
                className='flex cursor-pointer items-center'
                onClick={() => {
                  setSelectedSequenceRun(sequenceRunRowData as SequenceRunModel);
                  setQueryParams({ sequenceRunId: sequenceRunRowData.orcabusId });
                }}
              >
                <ChatBubbleBottomCenterTextIcon className='size-5 stroke-orange-300 stroke-3 hover:stroke-orange-600' />
              </div>
            </Tooltip> */}
            <Tooltip text='MultiQC Report' size='small' background='light'>
              <RedirectLink to={`/files?${filesParams.toString()}`}>
                <MultiqcIcon className='size-4 text-orange-300 hover:text-orange-600' />
              </RedirectLink>
            </Tooltip>
            <Tooltip
              position='left'
              text='View metadata warehouse records'
              size='small'
              background='light'
            >
              <RedirectLink to={`/vault?${vaultParams.toString()}`}>
                <TableCellsIcon className='h-5 w-5 text-gray-400 hover:text-gray-600' />
              </RedirectLink>
            </Tooltip>
          </div>
        );
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

      {/* {(getQueryParams().sequenceRunId || selectedSequenceRun) && (
        <SequenceRunDetailsDrawer
          selectedSequenceRunId={getQueryParams().sequenceRunId}
          onCloseDrawer={onCloseDrawer}
        />
      )} */}
    </div>
  );
};

export default SequenceRunTable;
