import { Timeline } from '@/components/common/timelines';
import { FC, useEffect, useState } from 'react';
import { useWorkflowPayloadModel } from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';

interface JsonDisplayProps {
  selectedPayloadId: number;
}

const JsonDisplay: FC<JsonDisplayProps> = ({ selectedPayloadId }) => {
  const [selectPayloadId, setSelectPayloadId] = useState<number>(selectedPayloadId);
  useEffect(() => {
    setSelectPayloadId(selectedPayloadId);
  }, [selectedPayloadId]);

  const { data: selectedWorkflowPayloadData, isFetching } = useWorkflowPayloadModel({
    params: { path: { id: selectPayloadId } },
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
      {selectedWorkflowPayloadData ? (
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

interface StatusTimelineProps {
  workflowRuntimelineData: {
    id: number;
    content: string;
    datetime: string;
    comment: string;
    iconBackground: string;
    payloadId: number;
  }[];
}

const StatusTimeline: FC<StatusTimelineProps> = ({ workflowRuntimelineData }) => {
  const [selectedPayloadId, setSelectedPayloadId] = useState<number | null>(
    workflowRuntimelineData[0]?.payloadId || null
  );

  const handleTimelineSelect = (payloadId: number) => {
    setSelectedPayloadId(payloadId);
  };
  useEffect(() => {
    setSelectedPayloadId(workflowRuntimelineData[0]?.payloadId || null);
  }, [workflowRuntimelineData]);

  return (
    <div className='flex flex-row'>
      <Timeline
        timeline={workflowRuntimelineData}
        handldEventClick={handleTimelineSelect}
        selectId={selectedPayloadId}
      />

      {selectedPayloadId && <JsonDisplay selectedPayloadId={selectedPayloadId} />}
    </div>
  );
};

export default StatusTimeline;
