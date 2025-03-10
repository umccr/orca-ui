import { useState } from 'react';
import { useSuspenseWorkflowModel } from '@/api/workflow';
import { JsonToTable } from '@/components/common/json-to-table';
import { Dialog } from '@/components/common/dialogs';

export const WorkflowVersion = ({
  portalRunId,
  libraryOrcabusId,
}: {
  portalRunId: string;
  libraryOrcabusId: string;
}) => {
  const [isOpenWorkflowDetails, setIsOpenWorkflowDetails] = useState(false);

  const workflow = useSuspenseWorkflowModel({
    params: {
      query: {
        workflowrun__portalRunId: portalRunId,
        // The following query filter to ensure the portalRunId belongs to the library
        workflowrun__libraries__orcabusId: libraryOrcabusId,
      },
    },
  }).data?.results;

  // Only if there is exactly one workflow, show the workflow name and version
  if (workflow?.length !== 1) {
    throw new Error('PortalRunId (or URL link) is not valid!');
  }
  const wf = workflow[0];

  return (
    <div
      className='ml-6 flex h-full cursor-pointer items-center text-xs font-light text-blue-500 hover:text-blue-700'
      onClick={() => setIsOpenWorkflowDetails(true)}
    >
      {wf.workflowVersion}
      {isOpenWorkflowDetails && (
        <Dialog
          open={isOpenWorkflowDetails}
          title='Workflow Details'
          size='lg'
          content={<JsonToTable data={wf} />}
          onClose={() => setIsOpenWorkflowDetails(false)}
          closeBtn={{ label: 'Close', onClick: () => setIsOpenWorkflowDetails(false) }}
        />
      )}
    </div>
  );
};
