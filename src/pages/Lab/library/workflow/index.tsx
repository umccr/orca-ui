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

  const workflow = useWorkflowModel({
    params: { query: { workflowrun__libraries__libraryId: libraryId } },
  }).data?.results;

  if (!workflow?.length) {
    throw new Error('No library id in URL path!');
  }

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
        </div>
        <PortalRunIdDropdown />
      </div>

      {/* Body */}
      {portalRunId && <FileTable portalRunId={portalRunId} />}
    </div>
  );
}
