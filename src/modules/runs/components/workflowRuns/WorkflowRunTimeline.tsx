import { FC, useState, useEffect } from 'react';
import { Timeline } from '@/components/common/timelines';
import { ContentTabs } from '@/components/navigation/tabs';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { JsonToNestedList } from '@/components/common/json-to-table';
import { useWorkflowPayloadModel } from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import {
  PlusCircleIcon,
  CheckCircleIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

import { Tooltip } from '@/components/common/tooltips';
import { Dialog } from '@/components/dialogs';
import { Textarea } from '@headlessui/react';
// import toaster from '@/components/common/toaster';

interface JsonDisplayProps {
  selectedPayloadId?: number | null;
}

const JsonDisplay: FC<JsonDisplayProps> = ({ selectedPayloadId }) => {
  const [selectPayloadId, setSelectPayloadId] = useState<number | null>(selectedPayloadId || null);
  useEffect(() => {
    setSelectPayloadId(selectedPayloadId || null);
  }, [selectedPayloadId]);

  const { data: selectedWorkflowPayloadData, isFetching } = useWorkflowPayloadModel({
    params: { path: { id: selectPayloadId || 0 } },
    reactQuery: {
      enabled: !!selectPayloadId,
      placeholderData: keepPreviousData,
    },
  });

  return (
    <div className='relative bg-gray-50 border border-gray-300 rounded-md m-2 p-2 shadow-sm overflow-scroll'>
      {selectedWorkflowPayloadData && isFetching ? (
        <BackdropWithText text='Loading data...' isVisible={true} />
      ) : null}
      {selectedPayloadId && selectedWorkflowPayloadData ? (
        <pre className='whitespace-pre-wrap text-wrap text-xs text-gray-800'>
          {JSON.stringify(selectedWorkflowPayloadData || {}, null, 2)}
        </pre>
      ) : (
        <div className='flex flex-col gap-2 w-80'>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className='h-4 w-full' />
          ))}
        </div>
      )}
    </div>
  );
};
interface JsonToListDisplayProps {
  selectedPayloadId?: number | null;
}
const JsonToListDisplay: FC<JsonToListDisplayProps> = ({ selectedPayloadId }) => {
  const [selectPayloadId, setSelectPayloadId] = useState<number | null>(selectedPayloadId || null);
  useEffect(() => {
    setSelectPayloadId(selectedPayloadId || null);
  }, [selectedPayloadId]);

  const { data: selectedWorkflowPayloadData, isFetching } = useWorkflowPayloadModel({
    params: { path: { id: selectPayloadId || 0 } },
    reactQuery: {
      enabled: !!selectPayloadId,
      placeholderData: keepPreviousData,
    },
  });

  return (
    <JsonToNestedList
      data={selectedWorkflowPayloadData?.data as Record<string, unknown>}
      isFetchingData={isFetching}
    />
  );
};

interface WorkflowRunTimelineProps {
  workflowRuntimelineData: {
    id: number;
    content: string;
    datetime: string;
    comment: string;
    iconBackground: string;
    payloadId: number;
  }[];
}

const WorkflowRunTimeline: FC<WorkflowRunTimelineProps> = ({ workflowRuntimelineData }) => {
  const [selectedPayloadId, setSelectedPayloadId] = useState<number | null>(
    workflowRuntimelineData[workflowRuntimelineData.length - 1]?.payloadId || null
  );

  const [isOpenCommentDialog, setIsOpenCommentDialog] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [isOpenResolvedDialog, setIsOpenResolvedDialog] = useState<boolean>(false);
  const [resolvedComment, setResolvedComment] = useState<string>('');

  const handleComment = () => {
    console.log('sendComment', comment);
    setIsOpenCommentDialog(false);
    // toaster.success({ title: 'Comment added' });
  };

  const handleResolvedEvent = () => {
    console.log('sendResolvedComment', resolvedComment);
    setIsOpenResolvedDialog(false);
    // toaster.success({ title: 'Resolved Status added' });
  };

  const handleTimelineSelect = (payloadId: number | null) => {
    setSelectedPayloadId(payloadId);
  };
  useEffect(() => {
    setSelectedPayloadId(
      workflowRuntimelineData[workflowRuntimelineData.length - 1]?.payloadId || null
    );
  }, [workflowRuntimelineData]);

  const currentState = workflowRuntimelineData[0]?.content;
  console.log(workflowRuntimelineData);
  return (
    <div className='flex flex-row pb-4'>
      <div className='flex-1'>
        <div className='pb-4 flex flex-row gap-2 items-end'>
          <div className='text-base font-semibold '>Timeline</div>
          <Tooltip text='Add a new comment' position='top' background='white'>
            <PlusCircleIcon
              className='w-5 h-5 cursor-pointer stroke-gray-500 opacity-opacity-100'
              onClick={() => {
                setIsOpenCommentDialog(true);
              }}
            />
          </Tooltip>
          {currentState === 'FAILED' && (
            <Tooltip text='Add the Resolved Event' position='top' background='white'>
              <CheckCircleIcon
                className='w-5 h-5 cursor-pointer stroke-gray-500 opacity-opacity-100'
                onClick={() => {
                  setIsOpenResolvedDialog(true);
                }}
              />
            </Tooltip>
          )}
        </div>
        <Dialog
          TitleIcon={ChatBubbleBottomCenterTextIcon}
          open={isOpenCommentDialog}
          title='Add a new comment'
          content={
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-semibold'>Comment</div>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          }
          onClose={() => {
            setIsOpenCommentDialog(false);
          }}
          closeBtn={{
            label: 'Close',
            onClick: () => {
              setIsOpenCommentDialog(false);
            },
          }}
          confirmBtn={{ label: 'Confirm', onClick: handleComment }}
        ></Dialog>
        <Dialog
          TitleIcon={CheckCircleIcon}
          open={isOpenResolvedDialog}
          title='Add the Resolved Event'
          content={
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-semibold'>Comment</div>
              <Textarea
                value={resolvedComment}
                onChange={(e) => setResolvedComment(e.target.value)}
              />
            </div>
          }
          onClose={() => {
            setIsOpenResolvedDialog(false);
          }}
          closeBtn={{
            label: 'Close',
            onClick: () => {
              setIsOpenResolvedDialog(false);
            },
          }}
          confirmBtn={{ label: 'Confirm', onClick: handleResolvedEvent }}
        ></Dialog>

        <Timeline timeline={workflowRuntimelineData} handldEventClick={handleTimelineSelect} />
      </div>
      <div className='flex-2'>
        <div className='text-base font-semibold pb-4'>Payload</div>
        <ContentTabs
          tabs={[
            {
              label: 'List',
              content: <JsonToListDisplay selectedPayloadId={selectedPayloadId} />,
            },
            {
              label: 'JSON',
              content: <JsonDisplay selectedPayloadId={selectedPayloadId} />,
            },
          ]}
          withQueryParams={false}
        />
      </div>
    </div>
  );
};

export default WorkflowRunTimeline;
