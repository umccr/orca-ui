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
  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <ContentTabs tabs={tabs} />
    </div>
  );
};

export default AnalysisRunsDetails;
