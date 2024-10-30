import AnalysisRunDetailsTable from '../components/analysisRuns/AnalysisRunDetailsTable';
import AnalysisRunDetailsWorkflowRuns from '../components/analysisRuns/AnalysisRunDetailsWorkflowRuns';
import { ContentTabs } from '@/components/navigation/tabs';

const AnalysisRunsDetails = () => {
  const tabs = [
    {
      label: 'Analysis Context',
      content: <AnalysisRunDetailsTable />,
    },
    {
      label: 'Workflow Runs',
      content: <AnalysisRunDetailsWorkflowRuns />,
    },
  ];
  return <ContentTabs tabs={tabs} />;
};

export default AnalysisRunsDetails;
