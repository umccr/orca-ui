import AnalysisRunDetailsTable from '../components/analysisRuns/AnalysisRunDetailsTable';
import AnalysisRunDetailsWorkflowRuns from '../components/analysisRuns/AnalysisRunDetailsWorkflowRuns';
const AnalysisRunsDetails = () => {
  return (
    <div>
      <AnalysisRunDetailsTable />
      <AnalysisRunDetailsWorkflowRuns />
    </div>
  );
};

export default AnalysisRunsDetails;
