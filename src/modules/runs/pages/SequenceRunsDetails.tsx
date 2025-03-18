import SequenceRunTimeline from '../components/sequenceRuns/SequenceRunTimeline';
import SequenceRunDetailsHeader from '../components/sequenceRuns/SequenceRunDetailsHeader';
import SequenceRunDetailsSidebar from '../components/sequenceRuns/SequenceRunDetailsSidebar';
import SequenceRunDetailsLinkage from '../components/sequenceRuns/SequenceRunDetailsLinkage';
import { SequenceRunProvider } from '../components/sequenceRuns/SequenceRunContext';
import { SideBarLayout } from '@/components/common/sidebar';

const SequenceRunsDetails = () => {
  return (
    <SequenceRunProvider>
      <div className='no-scrollbar flex h-full w-full overflow-y-auto'>
        <div className='flex-grow'>
          <SideBarLayout
            main={
              <div className='flex flex-col gap-4'>
                <SequenceRunDetailsHeader />
                <SequenceRunDetailsLinkage />
                <SequenceRunTimeline hasAddCommentBtn={false} />
              </div>
            }
            mainClassName='no-scrollbar'
            sideBar={<SequenceRunDetailsSidebar />}
            sideBarClassName='overflow-y-auto no-scrollbar'
            sideBarPosition='right'
          />
        </div>
      </div>
    </SequenceRunProvider>
  );
};

export default SequenceRunsDetails;
