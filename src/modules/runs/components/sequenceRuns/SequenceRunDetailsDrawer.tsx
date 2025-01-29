import { FC, useState, useEffect, useMemo } from 'react';
import { useSequenceRunDetailModel } from '@/api/sequenceRun';
import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { JsonToList } from '@/components/common/json-to-table';
// import { ContentTabs } from '@/components/navigation/tabs';
import SequenceRunTimeline from './SequenceRunTimeline';
import { Accordion } from '@/components/common/accordion';
// import { ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface SequenceRunDetailsDrawerProps {
  selectedSequenceRunId: string;
  onCloseDrawer?: () => void;
}

const SequenceRunDetailsDrawer: FC<SequenceRunDetailsDrawerProps> = ({
  selectedSequenceRunId,
  onCloseDrawer,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: sequenceRunDetail, isFetching: isFetchingSequenceRunDetail } =
    useSequenceRunDetailModel({
      params: { path: { id: selectedSequenceRunId } },
      reactQuery: {
        enabled: !!selectedSequenceRunId,
      },
    });

  useEffect(() => {
    if (selectedSequenceRunId) {
      setIsOpen(true);
    }
  }, [selectedSequenceRunId]);

  const selectedSequenceRun = sequenceRunDetail;

  const sequenceRunDetailData = useMemo(() => {
    return selectedSequenceRun
      ? Object.fromEntries(
          Object.entries(selectedSequenceRun).map(([key, value]) => [
            key,
            value?.toString() ?? null,
          ])
        )
      : null;
  }, [selectedSequenceRun]);

  const handleCloseDrawer = () => {
    // call onCloseDrawer func after close drawer closed
    setIsOpen(false);
    sleep(300).then(() => {
      if (onCloseDrawer) {
        onCloseDrawer();
      }
    });
  };

  return (
    <SideDrawer
      title='Sequence Run Details'
      subtitle={selectedSequenceRun?.sequenceRunName || ''}
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      size='medium'
    >
      <div className='h-full flex-1 flex-col gap-4'>
        {/* Header Info */}
        {/* <div className='px-4 py-1'>
          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <InformationCircleIcon className='h-5 w-5' />
            <span>SequenceRunID: {selectedSequenceRun?.sequenceRunId || ''}</span>
          </div>
          <div className='mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <ClockIcon className='h-5 w-5' />
            <span>
              Time: {selectedSequenceRun?.startTime} - {selectedSequenceRun?.endTime}
            </span>
          </div>
        </div> */}

        {/* Content */}

        <Accordion
          title='Details'
          defaultOpen={false}
          className='px-4 py-1'
          chevronPosition='right'
        >
          <JsonToList data={sequenceRunDetailData} isFetchingData={isFetchingSequenceRunDetail} />
        </Accordion>

        <Accordion
          title='Timeline'
          defaultOpen={true}
          className='px-4 py-1'
          chevronPosition='right'
        >
          <SequenceRunTimeline selectedSequenceRunId={selectedSequenceRunId} />
        </Accordion>
      </div>
    </SideDrawer>
  );
};

export default SequenceRunDetailsDrawer;
