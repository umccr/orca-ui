import { useQueryParams } from '@/hooks/useQueryParams';
import { useAnalysisRunStatisticsModel } from '@/api/workflow';
import { PieChart } from '@/components/charts';
import { Table, Column, TableData } from '@/components/tables';
import { ContentTabs } from '@/components/navigation/tabs';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
import { useMemo } from 'react';

const ReportsContent = () => {
  const { getQueryParams } = useQueryParams();

  const { data: analysisRunStatisticsData } = useAnalysisRunStatisticsModel({
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

  // reduce to count on workflow name
  const workflowCount = analysisRunStatisticsData?.reduce((acc: Record<string, number>, curr) => {
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
  const workflowStatusCount = analysisRunStatisticsData?.reduce(
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
  const summaryTableColumns: Column[] = [
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
  ];

  console.log(analysisRunStatisticsData, workflowCount);

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

  const getSummaryTableDataByWorkflowType = (workflowType: string) => {
    return (
      analysisRunStatisticsData?.filter((data) => data.workflow.workflowName === workflowType) || []
    );
  };

  const workflowTypes = Object.keys(workflowCount || { test: 1 });
  const tabs = workflowTypes.map((type) => ({
    label: type,
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

      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>
        Overview Gantt Chart
      </div>
      <div>{/* <GanttChart /> */}</div>
      <div className='py-4 text-xl font-base border-b border-gray-200 pb-2'>Workflow Category</div>
      <div className='min-h-[300px]'>
        <ContentTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default ReportsContent;
