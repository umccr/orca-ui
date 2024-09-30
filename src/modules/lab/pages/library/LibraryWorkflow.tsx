import React, { Suspense } from 'react';
import { PortalRunIdDropdown } from '../../library/workflow/components/PortalRunIdDropdown';
import { useParams } from 'react-router-dom';
import { FileTable } from '../../library/workflow/components/FileTable';
import { SpinnerWithText } from '@/components/common/spinner';
import { WorkflowVersion } from '../../library/workflow/components/WorkflowVersion';

export default function LibraryWorkflowPage() {
  const { libraryId, portalRunId, workflowType } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  return (
    <div>
      {/* Header */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row'>
          <h1 className='flex h-full items-center font-bold'>{`${workflowType}`}</h1>
          {portalRunId && <WorkflowVersion portalRunId={portalRunId} libraryId={libraryId} />}
        </div>
        <PortalRunIdDropdown
          workflowType={workflowType}
          portalRunId={portalRunId}
          libraryId={libraryId}
        />
      </div>

      {/* Body */}
      {portalRunId && (
        <Suspense fallback={<SpinnerWithText text='Fetching related files ...' />}>
          <FileTable portalRunId={portalRunId} />
        </Suspense>
      )}
    </div>
  );
}
