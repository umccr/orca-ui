import { useMemo } from 'react';
import { useSequenceRunContext } from './SequenceRunContext';
import { Sidebar } from '@/components/common/sidebar';
import { AccordionList } from '@/components/common/accordion';

const SequenceRunDetailsSidebar = () => {
  const { sequenceRunDetail } = useSequenceRunContext();
  // format data and disply in the table

  const sequenceRunDetailsData = useMemo(
    () =>
      sequenceRunDetail
        ? {
            sequenceRunInfo: [
              {
                key: 'orcabusId',
                value: sequenceRunDetail.orcabusId,
              },
              {
                key: 'sequenceRunId',
                value: sequenceRunDetail.sequenceRunId,
              },
              {
                key: 'experimentName',
                value: sequenceRunDetail.experimentName,
              },
              {
                key: 'icaProjectId',
                value: sequenceRunDetail.icaProjectId,
              },
            ],
            runDetails: [
              {
                key: 'runStatus',
                value: sequenceRunDetail.status,
              },
              {
                key: 'runVolumeName',
                value: sequenceRunDetail.runVolumeName,
              },
              {
                key: 'runFolderPath',
                value: sequenceRunDetail.runFolderPath,
              },
              {
                key: 'runDataUri',
                value: sequenceRunDetail.runDataUri,
              },
              {
                key: 'startTime',
                value: sequenceRunDetail.startTime,
              },
              {
                key: 'endTime',
                value: sequenceRunDetail.endTime,
              },
            ],
            runProperties: [
              // {
              //   key: 'apiUrl',
              //   value: sequenceRunDetail.apiUrl,
              // },
              {
                key: 'flowcellBarcode',
                value: sequenceRunDetail.flowcellBarcode,
              },
              {
                key: 'reagentBarcode',
                value: sequenceRunDetail.reagentBarcode,
              },
              {
                key: 'sampleSheetName',
                value: sequenceRunDetail.sampleSheetName,
              },
              {
                key: 'v1pre3Id',
                value: sequenceRunDetail.v1pre3Id,
              },
            ],
          }
        : null,
    [sequenceRunDetail]
  );

  return (
    <Sidebar
      position='right'
      className='border-r-0'
      preferenceStorageKey='workflow-run-details-sidebar'
      openWidth='w-100'
    >
      <div className='mt-14'>
        {sequenceRunDetailsData ? (
          <div className='space-y-2'>
            <AccordionList
              title='Run Info'
              data={sequenceRunDetailsData?.sequenceRunInfo || []}
              defaultOpen={true}
              chevronPosition='right'
              buttonClassName='border-b  border-gray-200 dark:border-gray-700'
            />

            <AccordionList
              title='Run Details'
              data={sequenceRunDetailsData?.runDetails || []}
              defaultOpen={true}
              chevronPosition='right'
              buttonClassName='border-b border-gray-200 dark:border-gray-700'
            />

            <AccordionList
              title='Run Properties'
              data={sequenceRunDetailsData?.runProperties || []}
              defaultOpen={false}
              chevronPosition='right'
              buttonClassName='border-b border-gray-200 dark:border-gray-700'
            />
          </div>
        ) : (
          <div className='flex h-full items-center justify-center'>No data</div>
        )}
      </div>
    </Sidebar>
  );
};

export default SequenceRunDetailsSidebar;
