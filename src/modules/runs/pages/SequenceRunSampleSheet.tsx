import { useParams } from 'react-router-dom';
import { useSequenceRunSampleSheetsByInstrumentRunIdModel } from '@/api/sequenceRun';
import SequenceRunSampleSheetViewer from '@/modules/runs/components/sequenceRuns/SequenceRunSampleSheetViewer';
import { SampleSheetModel } from '@/utils/samplesheetUtils';
import { SpinnerWithText } from '@/components/common/spinner';
import { DocumentIcon } from '@heroicons/react/24/outline';
import FileViewDialog from '../components/common/FileViewDialog';
import { useMemo, useState } from 'react';

const NoSampleSheetFound = () => (
  <div className='flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
    <div className='flex flex-col items-center gap-3 text-center'>
      <div className='rounded-full bg-gray-100 p-3 dark:bg-gray-800'>
        <DocumentIcon className='h-8 w-8 text-gray-400 dark:text-gray-500' />
      </div>
      <div>
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
const SequenceRunsSampleSheet = () => {
  const { instrumentRunId } = useParams();

  const [isOpenFileViewDialog, setIsOpenFileViewDialog] = useState(false);

  const {
    data: sequenceRunSamplesheet,
    isLoading: isLoadingSequenceRunSamplesheet,
    error: sequenceRunSamplesheetError,
  } = useSequenceRunSampleSheetsByInstrumentRunIdModel({
    params: { path: { instrumentRunId: instrumentRunId as string } },
  });

  const [selectedSamplesheetOrcabusId, setSelectedSamplesheetOrcabusId] = useState<string | null>(
    null
  );
  const selectedSamplesheet = useMemo(() => {
    if (!selectedSamplesheetOrcabusId) return null;
    return sequenceRunSamplesheet?.find(
      (samplesheet) => samplesheet.orcabusId === selectedSamplesheetOrcabusId
    );
  }, [sequenceRunSamplesheet, selectedSamplesheetOrcabusId]);

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
    !sequenceRunSamplesheet[0].sampleSheetContent
  ) {
    return <NoSampleSheetFound />;
  }

  const handleSelectSamplesheet = (orcabusId: string) => {
    setSelectedSamplesheetOrcabusId(orcabusId);
    setIsOpenFileViewDialog(true);
  };

  return (
    <div className='flex flex-col gap-4'>
      {sequenceRunSamplesheet.map((samplesheet) => (
        <SequenceRunSampleSheetViewer
          key={samplesheet.orcabusId}
          sampleSheetData={samplesheet.sampleSheetContent as SampleSheetModel}
          sampleSheetName={samplesheet.sampleSheetName}
          sampleSheetOrcabusId={samplesheet.orcabusId}
          handleSelectSamplesheet={handleSelectSamplesheet}
        />
      ))}
      {/* File View Dialog */}
      <FileViewDialog
        isOpenFileViewDialog={isOpenFileViewDialog}
        setIsOpenFileViewDialog={setIsOpenFileViewDialog}
        fileName={selectedSamplesheet?.sampleSheetName ?? ''}
        fileContent={selectedSamplesheet?.sampleSheetContent ?? null}
        isLoading={false}
      />
    </div>
  );
};

export default SequenceRunsSampleSheet;
