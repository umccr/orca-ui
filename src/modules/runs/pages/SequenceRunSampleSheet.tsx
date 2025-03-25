import { useParams } from 'react-router-dom';
import { useSequenceRunSampleSheetModel } from '@/api/sequenceRun';
import SequenceRunSampleSheetViewer from '@/modules/runs/components/sequenceRuns/SequenceRunSampleSheetViewer';
import { SampleSheetModel } from '@/utils/samplesheetUtils';
import { SpinnerWithText } from '@/components/common/spinner';
import { DocumentIcon } from '@heroicons/react/24/outline';
const SequenceRunsSampleSheet = () => {
  const { orcabusId } = useParams();

  const {
    data: sequenceRunSamplesheet,
    isLoading: isLoadingSequenceRunSamplesheet,
    error: sequenceRunSamplesheetError,
  } = useSequenceRunSampleSheetModel({
    params: { path: { orcabusId: orcabusId as string } },
  });

  if (isLoadingSequenceRunSamplesheet) {
    return (
      <div className='flex h-full items-center justify-center'>
        <SpinnerWithText text='Loading sample sheet...' />
      </div>
    );
  }

  if (
    sequenceRunSamplesheetError ||
    !sequenceRunSamplesheet ||
    !sequenceRunSamplesheet.sampleSheetContent
  ) {
    return (
      <div className='rounded-lg bg-white shadow dark:bg-gray-800'>
        <div className='flex h-60 flex-col items-center justify-center gap-4 p-8'>
          <div className='rounded-full bg-gray-100 p-3 dark:bg-gray-700'>
            <DocumentIcon className='h-8 w-8 text-gray-400 dark:text-gray-500' />
          </div>
          <div className='text-center'>
            <h3 className='mb-1 text-base font-medium text-gray-900 dark:text-gray-100'>
              No Sample Sheet Available
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              The sample sheet data for this sequence run could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-4'>
      <SequenceRunSampleSheetViewer
        sampleSheetData={sequenceRunSamplesheet?.sampleSheetContent as SampleSheetModel}
        sampleSheetName={sequenceRunSamplesheet?.sampleSheetName}
      />
    </div>
  );
};

export default SequenceRunsSampleSheet;
