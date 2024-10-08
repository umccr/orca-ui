import React, { Suspense } from 'react';
import { PortalRunIdDropdown } from '../../components/library/PortalRunIdDropdown';
import { useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
import { WorkflowVersion } from '../../components/library/WorkflowVersion';
import { FileAPITable, getTableColumn } from '@/modules/files/components/FileAPITable';

export default function LibraryWorkflowPage() {
  const { libraryId, portalRunId, workflowType } = useParams();
  if (!libraryId || !workflowType) {
    throw new Error('Invalid URL!');
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
          <FileAPITable
            isSearchBoxKey={true}
            additionalQueryParam={{ 'attributes[portalRunId]': portalRunId }}
            tableColumn={getTableColumn({ isHideKeyPrefix: true })}
          />
        </Suspense>
      )}
    </div>
  );
}
