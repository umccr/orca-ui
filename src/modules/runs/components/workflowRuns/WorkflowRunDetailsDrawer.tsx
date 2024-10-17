import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { FC, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useWorkflowStateModel,
  useWorkflowRunDetailModel,
  WorkflowRunModel,
  useWorkflowRunCommentModel,
} from '@/api/workflow';
// import StatusTimeline from './StatusTimeline';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';

import { classNames } from '@/utils/commonUtils';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { BackdropWithText } from '@/components/common/backdrop';
import { ContentTabs } from '@/components/navigation/tabs';
import StatusTimeline from './StatusTimeline';
// import WorkflowRunTimeline from './WorkflowRunTimeline';

interface WorkflowRunDetailsDrawerProps {
  selectedWorkflowRunOrcabusId: string;
  onCloseDrawer?: () => void;
}

export const WorkflowRunDetailsDrawer: FC<WorkflowRunDetailsDrawerProps> = ({
  selectedWorkflowRunOrcabusId,
  onCloseDrawer,
}) => {
  // const [selectedPayloadId, setSelectedPayloadId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // setWorkflowRunId(selectedWorkflowRunId);
    if (selectedWorkflowRunOrcabusId) {
      setIsOpen(true);
    }
  }, [selectedWorkflowRunOrcabusId]);

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { orcabusId: selectedWorkflowRunOrcabusId } },
      reactQuery: {
        enabled: !!selectedWorkflowRunOrcabusId,
      },
    });

  const { data: workflowStateData, isFetching } = useWorkflowStateModel({
    params: { path: { wfrOrcabusId: selectedWorkflowRunOrcabusId.split('.')[1] } },
  });

  const { data: workflowCommentData, isFetching: isFetchingWorkflowComment } =
    useWorkflowRunCommentModel({
      params: { query: { workflow_run__id: selectedWorkflowRunId } },
    });

  console.log(
    'workflowCommentData',
    workflowCommentData,
    'isFetchingWorkflowComment',
    isFetchingWorkflowComment
  );

  const workflowState = workflowStateData?.results;
  const workflowRuntimelineData = useMemo(
    () =>
      workflowState
        ? workflowState
            .map((state) => ({
              id: state.orcabusId,
              content: state.status,
              datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
              comment: state.comment || '',
              // icon: <StatusIcon status={state.status} />,
              iconBackground: statusBackgroundColor(getBadgeType(state.status)),
              payloadId: state?.payload || 1,
            }))
            .sort((a, b) => (dayjs(b.datetime).isAfter(dayjs(a.datetime)) ? 1 : -1))
        : [],
    [workflowState]
  );

  console.log('workflowRuntimelineData', workflowRuntimelineData);

  const selectedWorkflowRun = workflowRunDetail;

  // format data and disply in the table
  const detailsData = useMemo(
    () =>
      selectedWorkflowRun
        ? {
            portalRunId: selectedWorkflowRun.portalRunId,
            executionId: selectedWorkflowRun.executionId || '-',
            workflowType:
              selectedWorkflowRun.workflow.workflowName +
              ' v' +
              selectedWorkflowRun.workflow.workflowVersion,
            excutionEngine: selectedWorkflowRun.workflow.executionEngine,
            approvalState: selectedWorkflowRun.workflow.approvalState,
            currentState: (selectedWorkflowRun.currentState.status as string) || '-',
            timestamp: (selectedWorkflowRun.currentState.timestamp as string) || '-',
            comments: selectedWorkflowRun.comment || '-',
          }
        : null,
    [selectedWorkflowRun]
  );

  const librariesTableData = useMemo(
    () =>
      selectedWorkflowRun && selectedWorkflowRun.libraries.length > 0
        ? selectedWorkflowRun.libraries.map((library) => ({
            libraryId: library.libraryId,
            orcabusId: library.orcabusId,
          }))
        : [],
    [selectedWorkflowRun]
  );

  const librariesTableColumns = useMemo(
    () => [
      {
        header: 'Library ID',
        accessor: 'libraryId',
      },
      {
        header: 'Orcabus ID',
        accessor: 'orcabusId',
        cell: (orcabusId: unknown) => {
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${orcabusId}/overview`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {orcabusId as string}
              </Link>
            );
          }
        },
      },
    ],
    []
  );

  const handleCloseDrawer = () => {
    // call onCloseDrawer func after close drawer closed
    setIsOpen(false);
    sleep(300).then(() => {
      onCloseDrawer && onCloseDrawer();
    });
  };

  return (
    <SideDrawer
      title='Workflow Run Details'
      subtitle={selectedWorkflowRun?.workflowRunName || ''}
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      size='medium'
    >
      <ContentTabs
        tabs={[
          {
            label: 'Details',
            content: (
              <div>
                {/* <div className='pt-4 w-full flex flex-row gap-2'> */}
                <div className='flex-1'>
                  <JsonToList
                    // title='Details'
                    data={detailsData}
                    isFetchingData={isFetchingWorkflowRunDetail}
                  />
                </div>
                <div className='flex-1'>
                  <Table
                    // tableHeader='Libraries'
                    inCard={true}
                    columns={librariesTableColumns}
                    tableData={librariesTableData}
                    isFetchingData={isFetchingWorkflowRunDetail}
                  />
                </div>
                {/* </div> */}
              </div>
            ),
          },
          {
            label: 'Timeline',
            content: (
              <div className='pt-4'>
                <div className='relative flex flex-col'>
                  <div className='text-base font-semibold pb-4'>Timeline</div>
                  {isFetching && <BackdropWithText text='Loading Status data...' />}
                  <StatusTimeline workflowRuntimelineData={workflowRuntimelineData} />
                  {/* <WorkflowRunTimeline workflowRuntimelineData={workflowRuntimelineData} /> */}
                </div>
              </div>
            ),
          },
        ]}
        tabQueryParam='sideDrawerTab'
      />
      {/* <div className='h-full'>
        <div className='pt-4 w-full flex flex-row gap-2'>
          <div className='flex-1'>
            <JsonToList
              title='Details'
              data={detailsData}
              isFetchingData={isFetchingWorkflowRunDetail}
            />
          </div>
          <div className='flex-1'>
            <Table
              tableHeader='Libraries'
              inCard={true}
              columns={librariesTableColumns}
              tableData={librariesTableData}
              isFetchingData={isFetchingWorkflowRunDetail}
            />
          </div>
        </div>
        <div className='pt-4'>
          <div className='relative flex flex-col'>
            <div className='text-base font-semibold pb-4'>Timeline</div>
            {isFetching && <BackdropWithText text='Loading Status data...' />}
            <StatusTimeline workflowRuntimelineData={workflowRuntimelineData} />
          </div>
        </div>
      </div> */}
    </SideDrawer>
  );
};
