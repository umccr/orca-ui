import { useMemo } from 'react';
import { Table, Column, TableData } from '@/components/tables';
import { useQueryParams } from '@/hooks/useQueryParams';
import { classNames } from '@/utils/commonUtils';
import { keepPreviousData } from '@tanstack/react-query';
// import { dayjs } from '@/utils/dayjs';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { Badge } from '@/components/common/badges';
import {
  AnalysisModel,
  ComputeContextModel,
  StorageContextModel,
  useAnalysisRunListModel,
} from '@/api/workflow';
import { Link } from 'react-router-dom';

const AnalysisRunTable = () => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();
  const {
    data: analysisRunsData,
    isFetching: isFetchingAnalysisRuns,
    isError,
    error,
  } = useAnalysisRunListModel({
    params: {
      query: {
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || DEFAULT_PAGE_SIZE,
        search: getQueryParams().search || undefined,
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

  const analysisRunColumn: Column[] = useMemo(
    () => [
      {
        header: 'Analysis Run Name',
        accessor: 'analysisRunName',
        cell: (analysisRunName: unknown, analysisRunRowData: TableData) => {
          const id = analysisRunRowData.orcabusId;
          if (!analysisRunName) {
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
                    {(analysisRunName as string).toLocaleLowerCase()}
                  </Link>
                </div>
              </div>
            );
          }
        },
      },
      {
        header: 'Status',
        accessor: 'status',
        cell: (status: unknown) => {
          return (
            <Badge status={(status as string) || 'unknown'}>
              {(status as string) || 'unknown'}
            </Badge>
          );
        },
      },
      {
        header: 'Analysis',
        accessor: 'analysis',
        cell: (analysis: unknown) => {
          return (
            <div className='flex flex-row items-center'>
              <div className='rounded-sm px-2 text-sm font-normal text-gray-900'>
                {(analysis as AnalysisModel).analysisName}
              </div>
              <div className='rounded-sm px-2 text-sm font-normal text-gray-500'>
                {`v ${(analysis as AnalysisModel).analysisVersion}`}
              </div>
            </div>
          );
        },
      },
      {
        header: 'Compute Context',
        accessor: 'computeContext',
        cell: (computeContext: unknown) => {
          return <div>{(computeContext as ComputeContextModel).name}</div>;
        },
      },
      {
        header: 'Storage Context',
        accessor: 'storageContext',
        cell: (storageContext: unknown) => {
          return <div>{(storageContext as StorageContextModel).name}</div>;
        },
      },
      {
        header: 'Comment',
        accessor: 'comment',
        cell: (comment: unknown) => {
          return <div>{comment as string}</div>;
        },
      },
    ],
    []
  );

  return (
    <div>
      <Table
        columns={[...analysisRunColumn]}
        tableData={analysisRunsData?.results ?? []}
        inCard={true}
        isFetchingData={isFetchingAnalysisRuns}
        paginationProps={{
          totalCount: analysisRunsData?.pagination?.count ?? 0,
          rowsPerPage: analysisRunsData?.pagination?.rowsPerPage ?? DEFAULT_PAGE_SIZE,
          currentPage: analysisRunsData?.pagination?.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
          countUnit: 'analysis runs',
        }}
      />
    </div>
  );
};

export default AnalysisRunTable;
