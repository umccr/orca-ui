import { HorizontalTimeline } from '@/components/common/timelines';
import { FC, useEffect, useState } from 'react';
import { useWorkflowPayloadModel } from '@/api/workflow';
import { keepPreviousData } from '@tanstack/react-query';
import { BackdropWithText } from '@/components/common/backdrop';
import Skeleton from 'react-loading-skeleton';
import { JsonToNestedList } from '@/components/common/json-to-table';
import { ContentTabs } from '@/components/navigation/tabs';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
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

  /**
   * This is an EXPERIMENTAL approach where want to be able to redirect to the `/files` page
   * with filter to a specific key prefix if an s3 uri path is found as the value
   */
  const cellValueFormat = {
    condition: (value: unknown) => typeof value === 'string' && value.startsWith('s3://'),
    cell: (value: string) => {
      const s3Bucket = value.split('s3://')[1].split('/')[0];
      const s3Key = value.split(`s3://${s3Bucket}/`)[1];

      return (
        <Link
          // asterisk (*) is added to the end of the key to filter the path prefix
          to={`/files?key=${encodeURIComponent(s3Key)}*`}
          className={classNames('text-sm capitalize font-medium hover:text-blue-700 text-blue-500')}
        >
          {value}
        </Link>
      );
    },
  };

  return (
    <JsonToNestedList
      cellValueFormat={cellValueFormat}
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
      />
    </div>
  );
};

export default StatusTimeline;
