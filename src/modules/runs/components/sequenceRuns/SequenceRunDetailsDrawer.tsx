import { FC, useState, useEffect, useMemo } from 'react';
import { SequenceRunModel, useSequenceRunDetailModel } from '@/api/sequenceRun';
import { SideDrawer } from '@/components/common/drawers';
import { sleep } from '@/utils/commonUtils';
import { JsonToList } from '@/components/common/json-to-table';
interface SequenceRunDetailsDrawerProps {
  selectedSequenceRunData: SequenceRunModel | null;
  selectedSequenceRunId: string;
  onCloseDrawer?: () => void;
}
const SequenceRunDetailsDrawer: FC<SequenceRunDetailsDrawerProps> = ({
  selectedSequenceRunData,
  selectedSequenceRunId,
  onCloseDrawer,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: sequenceRunDetail, isFetching: isFetchingSequenceRunDetail } =
    useSequenceRunDetailModel({
      params: { path: { id: Number(selectedSequenceRunId) } },
      reactQuery: {
        enabled: !!selectedSequenceRunId && !selectedSequenceRunData,
      },
    });

  useEffect(() => {
    if (selectedSequenceRunId) {
      setIsOpen(true);
    }
  }, [selectedSequenceRunId]);

  const selectedSequenceRun = selectedSequenceRunData || sequenceRunDetail;

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
      if (onCloseDrawer) onCloseDrawer();
    });
  };

  return (
    <SideDrawer
      title='Sequence Run Details'
      subtitle={selectedSequenceRunData?.sequenceRunName || ''}
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      size='medium'
    >
      <div className='h-full'>
        <JsonToList
          title='Details'
          data={sequenceRunDetailData}
          isFetchingData={isFetchingSequenceRunDetail}
        />
      </div>
    </SideDrawer>
  );
};

export default SequenceRunDetailsDrawer;
