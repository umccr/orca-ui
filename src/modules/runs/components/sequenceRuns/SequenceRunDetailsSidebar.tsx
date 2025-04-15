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
                key: 'instrumentRunId',
                value: sequenceRunDetail[0].instrumentRunId,
              },
              {
                key: 'sequenceRunId',
                value: sequenceRunDetail[0].sequenceRunId,
              },
              {
                key: 'experimentName',
                value: sequenceRunDetail[0].experimentName,
              },
              {
                key: 'icaProjectId',
                value: sequenceRunDetail[0].icaProjectId,
              },
            ],
            runDetails: [
              {
                key: 'runStatus',
                value: sequenceRunDetail[0].status,
              },
              {
                key: 'runVolumeName',
                value: sequenceRunDetail[0].runVolumeName,
              },
              {
                key: 'runFolderPath',
                value: sequenceRunDetail[0].runFolderPath,
              },
              {
                key: 'runDataUri',
                value: sequenceRunDetail[0].runDataUri,
              },
              {
                key: 'startTime',
                value: sequenceRunDetail[0].startTime,
              },
              {
                key: 'endTime',
                value: sequenceRunDetail[0].endTime,
              },
            ],
            runProperties: [
              // {
              //   key: 'apiUrl',
              //   value: sequenceRunDetail.apiUrl,
              // },
              {
                key: 'flowcellBarcode',
                value: sequenceRunDetail[0].flowcellBarcode,
              },
              {
                key: 'reagentBarcode',
                value: sequenceRunDetail[0].reagentBarcode,
              },
              {
                key: 'sampleSheetName',
                value: sequenceRunDetail[0].sampleSheetName,
              },
              {
                key: 'v1pre3Id',
                value: sequenceRunDetail[0].v1pre3Id,
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
