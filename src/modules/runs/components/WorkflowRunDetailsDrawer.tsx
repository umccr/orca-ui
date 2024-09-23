import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { FC, useEffect, useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useWorkflowRunDetailModel, useWorkflowStateModel } from '@/api/workflow';
import StatusTimeline from './StatusTimeline';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';

import { classNames } from '@/utils/commonUtils';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';

interface WorkflowRunDetailsDrawerProps {
  selectedWorkflowRunId: string;
  onCloseDrawer?: () => void;
}

export const WorkflowRunDetailsDrawer: FC<WorkflowRunDetailsDrawerProps> = ({
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

  const { data: workflowRunDetail } = useWorkflowRunDetailModel({
    params: { path: { id: Number(selectedWorkflowRunId) } },
  });

  // need new UI to handle this error
  if (!workflowRunDetail) {
    throw new Error('No Data');
  }

  const { data: workflowStateData } = useWorkflowStateModel({
    params: { path: { workflowrunId: selectedWorkflowRunId } },
  });

  const workflowState = workflowStateData?.results;
  const workflowRuntimelineData = useMemo(
    () =>
      workflowState
        ? workflowState.map((state) => ({
            id: state.id,
            content: state.status,
            datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            comment: state.comment || '',
            // icon: <StatusIcon status={state.status} />,
            iconBackground: statusBackgroundColor(getBadgeType(state.status)),
            payloadId: state.payload || 1,
          }))
        : [],
    [workflowState]
  );

  const DrawerContent = () => {
    // format data and disply in the table
    const detailsData = useMemo(
      () =>
        workflowRunDetail && {
          portalRunId: workflowRunDetail.portalRunId,
          executionId: workflowRunDetail.executionId || '-',
          workflowType:
            workflowRunDetail.workflow.workflowName +
            ' v' +
            workflowRunDetail.workflow.workflowVersion,
          excutionEngine: workflowRunDetail.workflow.executionEngine,
          approvalState: workflowRunDetail.workflow.approvalState,
          currentState: (workflowRunDetail.currentState.status as string) || '-',
          timestamp: (workflowRunDetail.currentState.timestamp as string) || '-',
          comments: workflowRunDetail.comment || '-',
        },
      []
    );

    const librariesTableData = useMemo(
      () =>
        workflowRunDetail && workflowRunDetail.libraries.length > 0
          ? workflowRunDetail.libraries.map((library) => ({
              libraryId: library.libraryId,
              orcabusId: library.orcabusId,
            }))
          : [],
      []
    );

    const librariesTableColumns = [
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
    ];

    return (
      <div className='h-full'>
        <JsonToList title='Details' data={detailsData} />

        <div className='pt-4'>
          <Table
            tableHeader='Libraries'
            inCard={false}
            columns={librariesTableColumns}
            tableData={librariesTableData}
          />
        </div>
        <div className='pt-4'>
          <div className='flex flex-col'>
            <div className='text-base font-semibold pb-4'>Timeline</div>
            <Suspense fallback={<div>Loading drawer data...</div>}>
              <StatusTimeline workflowRuntimelineData={workflowRuntimelineData} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
    sleep(300).then(() => {
      onCloseDrawer && onCloseDrawer();
    });
  };

  return (
    <SideDrawer
      title='Workflow Run Details'
      // subtitle={workflowRunDetail?.workflowRunName || ''}
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      // content={
      //   <Suspense fallback={<div>Loading drawer data...</div>}>
      //     <DrawerContent />
      //   </Suspense>
      // }
    >
      <Suspense fallback={<div>Loading drawer data...</div>}>
        <DrawerContent />
      </Suspense>
    </SideDrawer>
  );
};
