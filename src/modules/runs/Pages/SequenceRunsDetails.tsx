import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';
import { ContentTabs } from '@/components/navigation/tabs';
import Breadcrumb from '@/components/navigation/breadcrumbs';
import LibraryTable from '../components/LibraryTable';

import SequenceRunOverview from '../components/SequenceRunOverview';
import SequenceRunsFastqTable from '../components/SequenceRunFastQ';
import SequenceRunWorkflows from '../components/SequenceRunWorkflows';

const SequenceRunsDetails = () => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
        <MainArea>
          <Breadcrumb />

          <ContentTabs
            tabs={[
              { label: 'Overview', content: <SequenceRunOverview /> },
              { label: 'Librarys', content: <LibraryTable /> },
              { label: 'Fastq', content: <SequenceRunsFastqTable /> },
              {
                label: 'Workflows',
                content: <SequenceRunWorkflows />,
              },
            ]}
          />
        </MainArea>
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default SequenceRunsDetails;
