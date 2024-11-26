import { useQueryParams } from '@/hooks/useQueryParams';
import { useWorkflowRunListAllModel } from '@/api/workflow';
import { PieChart, BarChart } from '@/components/charts';
import { Table, Column, TableData } from '@/components/tables';
import { ContentTabs } from '@/components/navigation/tabs';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
import { FC, useMemo } from 'react';

interface ReportsContentProps {
  isExporting?: boolean;
}

const ReportsContent: FC<ReportsContentProps> = ({ isExporting }) => {
  const { getQueryParams } = useQueryParams();

  // api call to get workflow run all data without pagination
  const { data: workflowRunListAllData } = useWorkflowRunListAllModel({
    params: {
      query: {
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
    reactQuery: {
      enabled: !!getQueryParams().startDate && !!getQueryParams().endDate,
    },
  });

  /*********** workflow count by workflow name ***********/
  // reduce to count on workflow name
  const workflowCount = workflowRunListAllData?.reduce((acc: Record<string, number>, curr) => {
    if (acc[curr.workflow.workflowName]) {
      acc[curr.workflow.workflowName] += 1;
    } else {
      acc[curr.workflow.workflowName] = 1;
    }
    return acc;
  }, {});

  const workflowCountData = Object.entries(workflowCount || {}).map(([name, count]) => ({
    name,
    value: count,
  }));
  // reduce to count on workflow name and current status
  //result: [{name: 'workflow name', end_status: 'status', value: 'count'}]
  const workflowStatusCount = workflowRunListAllData?.reduce(
    (acc: Record<string, number>, curr) => {
      if (acc[`${curr.workflow.workflowName}-${curr.currentState.status}`]) {
        acc[`${curr.workflow.workflowName}-${curr.currentState.status}`] += 1;
      } else {
        acc[`${curr.workflow.workflowName}-${curr.currentState.status}`] = 1;
      }
      return acc;
    },
    {}
  );
  const summaryTableData: TableData[] = Object.entries(workflowStatusCount || {})
    .map(([name, count]) => ({
      name: name.split('-')[0],
      end_status: name.split('-')[1],
      value: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const summaryTableColumns: Column[] = useMemo(
    () => [
      { header: 'Workflow type', accessor: 'name' },
      {
        header: 'Workflow end_status',
        accessor: 'end_status',
        cell: (end_status: unknown) => {
          return (
            <Badge status={end_status as string} type='success'>
              {end_status as string}
            </Badge>
          );
        },
      },
      { header: 'Count', accessor: 'value' },
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
                    to={`/runs/workflow/${id}`}
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

  /********** workflow count by analysis ***********/
  const workflowAnalysisCount = workflowRunListAllData?.reduce(
    (acc: Record<string, number>, curr) => {
      const label = `${curr.analysisRun.analysis.analysisName}-${curr.analysisRun.analysis.analysisVersion}-${curr.analysisRun.analysisRunName}-${curr.analysisRun.orcabusId}`;
      if (acc[label]) {
        acc[label] += 1;
      } else {
        acc[label] = 1;
      }
      return acc;
    },
    {}
  );

  const workflowAnalysisCountColumns = useMemo(
    () => [
      {
        header: 'Analysis',
        accessor: 'analysisName',
        cell: (analysisName: unknown, analysisRowData: TableData) => {
          const analysisVersion = analysisRowData.analysisVersion;
          return (
            <div>
              {analysisName as string} v{analysisVersion as string}
            </div>
          );
        },
      },
      {
        header: 'AnalysisRun',
        accessor: 'analysisRunName',
        cell: (analysisRunName: unknown, analysisRunRowData: TableData) => {
          const orcabusId = analysisRunRowData.orcabusId;
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/runs/analysis/${orcabusId}`}
                className={classNames('text-sm font-medium hover:text-blue-700 text-blue-500')}
              >
                <div>{analysisRunName as string}</div>
              </Link>
            );
          }
        },
      },
      { header: 'Count', accessor: 'value' },
    ],
    []
  );

  const workflowAnalysisCountData = Object.entries(workflowAnalysisCount || {}).map(
    ([name, count]) => ({
      name,
      value: count,
    })
  );

  const workflowAnalysisCountDataByAnalysis = workflowAnalysisCountData.reduce(
    (acc: Record<string, number>, curr) => {
      const label = `${curr.name.split('-')[0]}-${curr.name.split('-')[1]}`;
      if (acc[label]) {
        acc[label] += curr.value;
      } else {
        acc[label] = 1;
      }
      return acc;
    },
    {}
  );
  const workflowAnalysisCountDataSummaryByAnalysis = Object.entries(
    workflowAnalysisCountDataByAnalysis || {}
  ).map(([name, count]) => ({
    name: name.split('-')[0],
    version: name.split('-')[1],
    value: count,
  }));

  const workflowAnalysisCountChartData = workflowAnalysisCountDataSummaryByAnalysis.map((item) => ({
    name: `${item.name} v${item.version}`,
    value: item.value,
  }));

  const workflowAnalysisCountTableData = Object.entries(workflowAnalysisCount || {})
    .map(([name, count]) => ({
      analysisName: name.split('-')[0],
      analysisVersion: name.split('-')[1],
      analysisRunName: name.split('-')[2],
      orcabusId: name.split('-')[3],
      value: count,
    }))
    .sort((a, b) => a.analysisName.localeCompare(b.analysisName));

  console.log(workflowAnalysisCountData);

  /***** workflow Library statistics ***********/
  const workflowLibraryCount = workflowRunListAllData?.reduce(
    (acc: Record<string, number>, curr) => {
      // Handle each library in the array
      curr.libraries.forEach((library) => {
        if (acc[`${library.libraryId}-${library.orcabusId}`]) {
          acc[`${library.libraryId}-${library.orcabusId}`] += 1;
        } else {
          acc[`${library.libraryId}-${library.orcabusId}`] = 1;
        }
      });
      return acc;
    },
    {}
  );

  const workflowLibraryCountChartData = Object.entries(workflowLibraryCount || {}).map(
    ([name, count]) => ({
      name: name.split('-')[0],
      value: count,
    })
  );

  const workflowLibraryCountData = Object.entries(workflowLibraryCount || {}).map(
    ([name, count]) => ({
      libraryId: name.split('-')[0],
      orcabusId: name.split('-')[1],
      value: count,
    })
  );

  const workflowLibraryCountColumns = useMemo(
    () => [
      {
        header: 'Library',
        accessor: 'libraryId',
        cell: (libraryId: unknown, libraryRowData: TableData) => {
          const orcabusId = libraryRowData.orcabusId;
          console.log(libraryId, orcabusId);
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${orcabusId}`}
                className={classNames('text-sm font-medium hover:text-blue-700 text-blue-500')}
              >
                <div>{libraryId as string}</div>
              </Link>
            );
          }
        },
      },
      { header: 'Count', accessor: 'value' },
    ],
    []
  );

  /*********** get summary table data by workflow type ***********/
  const getSummaryTableDataByWorkflowType = (workflowType: string) => {
    return (
      workflowRunListAllData?.filter((data) => data.workflow.workflowName === workflowType) || []
    );
  };

  const workflowTypes = Object.keys(workflowCount || { test: 1 });
  const tabs = workflowTypes.map((type) => ({
    label: type + ' (' + workflowCount?.[type] + ')',
    content: (
      <Table
        tableData={getSummaryTableDataByWorkflowType(type)}
        columns={[...workflowRunColumn]}
        inCard={true}
      />
    ),
  }));

  return (
    <div className='flex flex-col'>
      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>Summary</div>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row w-1/2'>
          <PieChart data={workflowCountData} width={500} height={240} />
        </div>
        <div className='flex flex-row w-1/2'>
          <Table tableData={summaryTableData} columns={[...summaryTableColumns]} inCard={true} />
        </div>
      </div>

      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>Analysis</div>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row w-1/2'>
          <BarChart data={workflowAnalysisCountChartData} width={400} height={400} />
        </div>
        <div className='flex flex-row w-1/2'>
          <Table
            tableData={workflowAnalysisCountTableData}
            columns={[...workflowAnalysisCountColumns]}
            inCard={true}
          />
        </div>
      </div>

      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>Library</div>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row w-1/2'>
          <BarChart data={workflowLibraryCountChartData} width={500} height={240} />
        </div>
        <div className='flex flex-row w-1/2'>
          <Table
            tableData={workflowLibraryCountData}
            columns={[...workflowLibraryCountColumns]}
            inCard={true}
          />
        </div>
      </div>

      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>Workflow Metadata</div>
      <div className='min-h-[300px]'>
        {isExporting ? (
          // When exporting, render all tab contents sequentially
          <div className='flex flex-col gap-8'>
            {workflowTypes.map((type) => (
              <div key={type}>
                <h3 className='text-lg font-medium mb-4'>
                  {type} ({workflowCount?.[type]})
                </h3>
                <Table
                  tableData={getSummaryTableDataByWorkflowType(type)}
                  columns={[...workflowRunColumn]}
                  inCard={true}
                />
              </div>
            ))}
          </div>
        ) : (
          // Normal interactive view
          <ContentTabs tabs={tabs} />
        )}
      </div>
    </div>
  );
};

export default ReportsContent;
