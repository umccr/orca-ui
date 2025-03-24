import { useParams } from 'react-router-dom';
import { useSequenceRunSampleSheetModel } from '@/api/sequenceRun';
import SequenceRunSampleSheetViewer from '@/modules/runs/components/sequenceRuns/SequenceRunSampleSheetViewer';
import { SampleSheetModel } from '@/utils/samplesheetUtils';
import { SpinnerWithText } from '@/components/common/spinner';
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

  if (sequenceRunSamplesheetError || !sequenceRunSamplesheet) {
    return (
      <div className='rounded-lg bg-white shadow'>
        <div className='flex h-full items-center justify-center'>
          <p className='text-sm text-gray-500'>No sample sheet data available</p>
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
