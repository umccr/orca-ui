import React, { useState } from 'react';
import { PortalRunIdDropdown } from './components/PortalRunIdDropdown';
import { useWorkflowModel } from '@/api/workflow';
import { useParams } from 'react-router-dom';
import { Dialog } from '@/components/dialogs';
import { JsonToTable } from '@/components/common/json-to-table';
import { FileTable } from './components/FileTable';

export default function LibraryWorkflowPage() {
  const { libraryId, workflowType, portalRunId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const [isOpenWorkflowDetails, setIsOpenWorkflowDetails] = useState(false);

  // We could query by using portalRunId which give exact workflow record, but this API call is cached as it is
  // used for the librarySideNavBar. So we will just filter these value instead of another API call.
  const workflow = useWorkflowModel({
    // Disable until libraryId annotation is added to the workflow model (below only return mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { libraryId: libraryId } as any },
  }).data.results;

  const wf = workflow.filter((wf) => wf.workflowName === workflowType)[0];
  return (
    <div>
      {/* Header */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row'>
          <h1 className='flex h-full items-center font-bold'>{`${wf.workflowName}`}</h1>
          <div
            className='ml-6 flex h-full items-center font-light text-xs cursor-pointer text-blue-500 hover:text-blue-700'
            onClick={() => setIsOpenWorkflowDetails(true)}
          >
            {wf.workflowVersion}
            <Dialog
              open={isOpenWorkflowDetails}
              title='Workflow Details'
              content={<JsonToTable data={wf} />}
              onClose={() => setIsOpenWorkflowDetails(false)}
              closeBtn={{ label: 'Close', onClick: () => setIsOpenWorkflowDetails(false) }}
            />
          </div>
        </div>
        <PortalRunIdDropdown />
      </div>

      {/* Body */}
      {portalRunId && <FileTable portalRunId={portalRunId} />}
    </div>
  );
}
