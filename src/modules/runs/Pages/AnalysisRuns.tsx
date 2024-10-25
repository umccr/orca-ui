import { DetailedErrorBoundary } from '@/components/common/error';
import MainArea from '@/components/layouts/MainArea';
import AnalysisRunFilterHeader from '../components/analysisRuns/AnalysisRunFilterHeader';
import AnalysisRunTable from '../components/analysisRuns/AnalysisRunTable';

const AnalysisRuns = () => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load workflow runs data'>
      <MainArea>
        {/* <div className='text-2xl font-bold py-2'>Workflow</div> */}
        {/* workflow run filter header */}
        <AnalysisRunFilterHeader />
        {/* workflow run table */}
        <AnalysisRunTable />
      </MainArea>
    </DetailedErrorBoundary>
  );
};

export default AnalysisRuns;
