import { HorizontalTimeline } from '@/components/common/timelines';
import { FC, useEffect, useState } from 'react';
import { useWorkflowPayloadModel } from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { JsonToNestedList } from '@/components/common/json-to-table';
import { ContentTabs } from '@/components/navigation/tabs';
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
    workflowRuntimelineData[workflowRuntimelineData.length - 1]?.payloadId || null
  );

  const handleTimelineSelect = (payloadId: number) => {
    setSelectedPayloadId(payloadId);
  };
  useEffect(() => {
    setSelectedPayloadId(
      workflowRuntimelineData[workflowRuntimelineData.length - 1]?.payloadId || null
    );
  }, [workflowRuntimelineData]);

  return (
    <div className='flex flex-col pb-4'>
      <HorizontalTimeline
        timeline={workflowRuntimelineData}
        handldEventClick={handleTimelineSelect}
        selectId={selectedPayloadId}
      />

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
  );
};

export default StatusTimeline;
