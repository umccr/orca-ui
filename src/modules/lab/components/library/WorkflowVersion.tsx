import React, { useState } from 'react';
import { useSuspenseWorkflowModel } from '@/api/workflow';
import { JsonToTable } from '@/components/common/json-to-table';
import { Dialog } from '@/components/dialogs';

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
        // Ensure the portalRunId belongs to the library
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
      className='ml-6 flex h-full items-center font-light text-xs cursor-pointer text-blue-500 hover:text-blue-700'
      onClick={() => setIsOpenWorkflowDetails(true)}
    >
      {wf.workflowVersion}
      {isOpenWorkflowDetails && (
        <Dialog
          open={isOpenWorkflowDetails}
          title='Workflow Details'
          content={<JsonToTable data={wf} />}
          onClose={() => setIsOpenWorkflowDetails(false)}
          closeBtn={{ label: 'Close', onClick: () => setIsOpenWorkflowDetails(false) }}
        />
      )}
    </div>
  );
};
