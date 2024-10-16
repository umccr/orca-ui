import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { FC, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWorkflowStateModel, useWorkflowRunDetailModel, WorkflowRunModel } from '@/api/workflow';
import StatusTimeline from './StatusTimeline';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';

import { classNames } from '@/utils/commonUtils';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { BackdropWithText } from '@/components/common/backdrop';

interface WorkflowRunDetailsDrawerProps {
  selectedWorkflowRunData: WorkflowRunModel | null;
  selectedWorkflowRunId: string;
  onCloseDrawer?: () => void;
}

export const WorkflowRunDetailsDrawer: FC<WorkflowRunDetailsDrawerProps> = ({
  selectedWorkflowRunData,
  selectedWorkflowRunId,
  onCloseDrawer,
}) => {
  // const [selectedPayloadId, setSelectedPayloadId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // setWorkflowRunId(selectedWorkflowRunId);
    if (selectedWorkflowRunId) {
      setIsOpen(true);
    }
  }, [selectedWorkflowRunId]);

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { id: Number(selectedWorkflowRunId) } },
      reactQuery: {
        enabled: !!selectedWorkflowRunId && !selectedWorkflowRunData,
      },
    });

  const { data: workflowStateData, isFetching } = useWorkflowStateModel({
    params: { path: { workflowrunId: selectedWorkflowRunId } },
  });

  const workflowState = workflowStateData?.results;
  const workflowRuntimelineData = useMemo(
    () =>
      workflowState
        ? workflowState
            .map((state) => ({
              id: state.id,
              content: state.status,
              datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
              comment: state.comment || '',
              // icon: <StatusIcon status={state.status} />,
              iconBackground: statusBackgroundColor(getBadgeType(state.status)),
              payloadId: state?.payload || 1,
            }))
            .sort((a, b) => a.id - b.id)
        : [],
    [workflowState]
  );

  const selectedWorkflowRun = selectedWorkflowRunData || workflowRunDetail;

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
                to={`/lab/library/${orcabusId}`}
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
      <div className='h-full'>
        {/* <div className='pt-4 w-full flex flex-row gap-2'> */}
        <div className=''>
          <JsonToList
            title='Details'
            data={detailsData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div>
        <div className='pt-4'>
          <Table
            tableHeader='Libraries'
            inCard={true}
            columns={librariesTableColumns}
            tableData={librariesTableData}
            isFetchingData={isFetchingWorkflowRunDetail}
          />
        </div>
        {/* </div> */}
        <div className='pt-4'>
          <div className='relative flex flex-col'>
            <div className='text-base font-semibold pb-4'>Timeline</div>
            {isFetching && <BackdropWithText text='Loading Status data...' />}
            <StatusTimeline workflowRuntimelineData={workflowRuntimelineData} />
          </div>
        </div>
      </div>
    </SideDrawer>
  );
};
