import { Suspense } from 'react';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';
import { ContentTabs } from '@/components/navigation/tabs';
import Breadcrumb from '@/components/navigation/breadcrumbs';
import LibraryTable from '../components/LibraryTable';
import { WorkflowDiagram } from '@/components/diagrams';
import { mockStatusData } from '@/stories/Diagram.stories';
import SequenceRunReports from '../components/SequenceRunReports';
import { Select } from '@/components/common/select';
import WorkflowTable from '../components/WorkflowRunTable';

const SequenceRunsDetails = () => {
  return (
    <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
      <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
        <MainArea>
          <Breadcrumb />

          <ContentTabs
            tabs={[
              { label: 'Overview', content: <SequenceRunReports /> },
              { label: 'Details', content: <LibraryTable /> },
              {
                label: 'Data Journey',
                content: (
                  <div>
                    <div className='px-5 flex text-sm items-center align w-full max-w-lg md:max-w-xs'>
                      <label className='px-2' htmlFor='select'>
                        Data Journey
                      </label>
                      <Select
                        // id='select'
                        options={[
                          { value: '201419990435s', label: '201419990435s' },
                          { value: '201419990435s', label: '201419990435s' },
                          { value: '201419990435s', label: '201419990435s' },
                          { value: '201419990435s', label: '201419990435s' },
                        ]}
                        value={{ value: 'Data Journey', label: 'Data Journey' }}
                        onChange={(selected: any) => {
                          console.log(selected.value);
                        }}
                      />
                    </div>

                    <div className='w-[1000px] h-[300px]'>
                      <WorkflowDiagram pipelineType='wts' statusData={mockStatusData} />
                    </div>
                    <div className='flex flex-col'>
                      <WorkflowTable />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </MainArea>
      </DetailedErrorBoundary>
    </Suspense>
  );
};

export default SequenceRunsDetails;
