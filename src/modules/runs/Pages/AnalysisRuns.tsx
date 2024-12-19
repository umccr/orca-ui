import { DetailedErrorBoundary } from '@/components/common/error';
import AnalysisRunFilterHeader from '../components/analysisRuns/AnalysisRunFilterHeader';
import AnalysisRunTable from '../components/analysisRuns/AnalysisRunTable';

const AnalysisRuns = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load workflow runs data'>
      <div className='h-full w-full'>
        {/* <div className='text-2xl font-bold py-2'>Workflow</div> */}
        {/* workflow run filter header */}
        <AnalysisRunFilterHeader />
        {/* workflow run table */}
        <AnalysisRunTable />
      </div>
    </DetailedErrorBoundary>
  );
};

export default AnalysisRuns;
