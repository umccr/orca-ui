import { Timeline } from '@/components/common/timelines';
import { FC, Suspense, useEffect, useState } from 'react';
import { useWorkflowPayloadModel } from '@/api/workflow';

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
    workflowRuntimelineData[0].payloadId || null
  );

  const handleTimelineSelect = (payloadId: number) => {
    setSelectedPayloadId(payloadId);
  };

  return (
    <div className='flex flex-row'>
      <Timeline
        timeline={workflowRuntimelineData}
        handldEventClick={handleTimelineSelect}
        selectId={selectedPayloadId}
      />

      <JsonDisplay selectedPayloadId={selectedPayloadId} />
    </div>
  );
};

export default StatusTimeline;
