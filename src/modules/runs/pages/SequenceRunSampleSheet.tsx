import { SequenceRunSampleSheetProvider } from '../components/sequenceRuns/SequenceRunSampleSheetContext';
import SequenceRunSampleSheetComponent from '../components/sequenceRuns/SequenceRunSampleSheet';

const SequenceRunSampleSheet = () => {
  return (
    <SequenceRunSampleSheetProvider>
      <SequenceRunSampleSheetComponent />
    </SequenceRunSampleSheetProvider>
  );
};

export default SequenceRunSampleSheet;
