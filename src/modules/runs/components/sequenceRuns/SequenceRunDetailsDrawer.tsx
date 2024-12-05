import { FC, useState, useEffect, useMemo } from 'react';
import { useSequenceRunDetailModel } from '@/api/sequenceRun';
import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { JsonToList } from '@/components/common/json-to-table';
import { ContentTabs } from '@/components/navigation/tabs';
import SequenceRunTimeline from './SequenceRunTimeline';
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
      <ContentTabs
        tabs={[
          {
            label: 'Details',
            content: (
              <JsonToList
                title='Details'
                data={sequenceRunDetailData}
                isFetchingData={isFetchingSequenceRunDetail}
              />
            ),
          },
          {
            label: 'timeline',
            content: <SequenceRunTimeline selectedSequenceRunId={selectedSequenceRunId} />,
          },
        ]}
      />
      {/* <div className='h-full'>
        <JsonToList
          title='Details'
          data={sequenceRunDetailData}
          isFetchingData={isFetchingSequenceRunDetail}
        />
      </div> */}
    </SideDrawer>
  );
};

export default SequenceRunDetailsDrawer;
