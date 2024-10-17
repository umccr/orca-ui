import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { JsonToList } from '@/components/common/json-to-table';
import { Table } from '@/components/tables';
import {
  useWorkflowStateModel,
  useWorkflowRunDetailModel,
  useWorkflowRunCommentModel,
} from '@/api/workflow';
import { classNames } from '@/utils/commonUtils';
import { getBadgeType, statusBackgroundColor } from '@/components/common/badges';
import { dayjs } from '@/utils/dayjs';
import { BackdropWithText } from '@/components/common/backdrop';
import WorkflowRunTimeline from '../components/workflowRuns/WorkflowRunTimeline';

const WorkflowRunDetails = () => {
  const { workflowRunId } = useParams();

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { id: Number(workflowRunId) } },
      reactQuery: {
        enabled: !!workflowRunId,
      },
    });

  const { data: workflowStateData, isFetching } = useWorkflowStateModel({
    params: { path: { workflowrunId: workflowRunId } },
    reactQuery: {
      enabled: !!workflowRunId,
    },
  });

  const { data: workflowCommentData, isFetching: isFetchingWorkflowComment } =
    useWorkflowRunCommentModel({
      params: { path: { workflowrunId: workflowRunId } },
    });

  // format data and disply in the table
  const detailsData = useMemo(
    () =>
      workflowRunDetail
        ? {
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
          }
        : null,
    [workflowRunDetail]
  );

  const librariesTableData = useMemo(
    () =>
      workflowRunDetail && workflowRunDetail.libraries.length > 0
        ? workflowRunDetail.libraries.map((library) => ({
            libraryId: library.libraryId,
            orcabusId: library.orcabusId,
          }))
        : [],
    [workflowRunDetail]
  );

  const workflowState = workflowStateData?.results;
  const workflowRuntimelineData = useMemo(
    () =>
      workflowState
        ? workflowState.map((state) => ({
            id: state.id,
            content: state.status,
            datetime: dayjs(state.timestamp).format('YYYY-MM-DD HH:mm'),
            comment: state.comment || '',
            // icon: <StatusIcon status={state.status} />,
            iconBackground: statusBackgroundColor(getBadgeType(state.status)),
            payloadId: state?.payload || 1,
          }))
        : [],
    [workflowState]
  );
  const workflowComment = workflowCommentData?.results;
  const workflowCommentTimelineData = useMemo(
    () =>
      workflowComment
        ? workflowComment.map((comment) => ({
            id: comment.id,
            content: 'comment',
            datetime: dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm'),
            iconBackground: 'bg-green-100',
            comment: comment.comment,
          }))
        : [],
    [workflowComment]
  );

  const timelineData = [...workflowRuntimelineData, ...workflowCommentTimelineData].sort((a, b) =>
    dayjs(b.datetime).isAfter(dayjs(a.datetime)) ? 1 : -1
  );

  const librariesTableColumns = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div>
      <div className='pt-4 w-full flex flex-row gap-2'>
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
      </div>

      <div className='pt-4'>
        {isFetching && <BackdropWithText text='Loading Status data...' />}
        {/* <StatusTimeline workflowRuntimelineData={workflowRuntimelineData} /> */}
        <WorkflowRunTimeline workflowRuntimelineData={timelineData} />
      </div>
    </div>
  );
};

export default WorkflowRunDetails;
