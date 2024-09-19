import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { FC, useEffect, useState, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useWorkflowRunDetailModel,
  useWorkflowStateModel,
  useWorkflowPayloadModel,
} from '@/api/workflow';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';
import { Timeline } from '@/components/common/timelines';
import { classNames } from '@/utils/commonUtils';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';

interface JsonDisplayProps {
  selectedPayloadId: number | null;
}

const JsonDisplay: FC<JsonDisplayProps> = ({ selectedPayloadId }) => {
  const [selectPayloadId, setSelectPayloadId] = useState<number | null>(selectedPayloadId);
  useEffect(() => {
    setSelectPayloadId(selectedPayloadId);
  }, [selectedPayloadId]);

  const workflowPayloadModel = useWorkflowPayloadModel({
    params: { path: { id: selectPayloadId || 1 } },
  });

  const selectedWorkflowPayloadData = workflowPayloadModel.data || null;

  return (
    <Suspense fallback={<div> loading data .... </div>}>
      <div className='bg-gray-50 border border-gray-300 rounded-md m-2 p-2 shadow-sm overflow-scroll'>
        {selectedWorkflowPayloadData && (
          <pre className='whitespace-pre-wrap text-wrap text-xs text-gray-800'>
            {JSON.stringify(selectedWorkflowPayloadData, null, 2)}
          </pre>
        )}
      </div>
    </Suspense>
  );
};

interface WorkflowRunDetailsDrawerProps {
  selectedWorkflowRunId: string;
  onCloseDrawer?: () => void;
}

export const WorkflowRunDetailsDrawer: FC<WorkflowRunDetailsDrawerProps> = ({
  selectedWorkflowRunId,
  onCloseDrawer,
}) => {
  const [selectedPayloadId, setSelectedPayloadId] = useState<number | null>(null);
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

  useEffect(() => {
    if (workflowRunDetail) {
      setSelectedPayloadId(Number(workflowRunDetail.currentState.payload));
    }
  }, [workflowRunDetail]);

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

  // const workflowPayloadModel = useWorkflowPayloadModel({
  //   params: { path: { id: selectedPayloadId || 1 } },
  // });

  // const selectedWorkflowPayloadData = workflowPayloadModel.data || null;

  const handleTimelineSelect = (payloadId: number) => {
    setSelectedPayloadId(payloadId);
  };

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
            <div className='flex flex-row'>
              <Timeline
                timeline={workflowRuntimelineData}
                handldEventClick={handleTimelineSelect}
                selectId={selectedPayloadId}
              />

              <JsonDisplay selectedPayloadId={selectedPayloadId} />
            </div>
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
      subtitle={workflowRunDetail?.workflowRunName || ''}
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      content={<DrawerContent />}
    ></SideDrawer>
  );
};
