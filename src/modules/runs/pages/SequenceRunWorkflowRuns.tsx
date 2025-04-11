import SequenceRunWorkflowRunsStats from '../components/sequenceRuns/SequenceRunWorkflowRunsStats';
import SequenceRunWorkflowRuns from '../components/sequenceRuns/SequenceRunWorkflowRuns';
import { NotificationContainer } from '@/components/common/notification';

const SequenceRunsWorkflowRuns = () => {
  return (
    <div className='flex flex-col gap-4'>
      <NotificationContainer
        notifications={[
          {
            title: 'Notification: Workflow Runs Data May Be Incomplete ',
            message:
              'Please note that some data may not be displayed because this table only displays workflow runs within two days after sequencing is completed. Data generated beyond this two-day window may not appear in the current record. Future updates will include all workflow runs related to the current sequence.',
            type: 'warning',
          },
        ]}
      />
      <SequenceRunWorkflowRunsStats />
      <SequenceRunWorkflowRuns />
    </div>
  );
};

export default SequenceRunsWorkflowRuns;
