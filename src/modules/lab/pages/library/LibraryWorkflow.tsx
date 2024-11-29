import React, { Suspense } from 'react';
import { PortalRunIdDropdown } from '../../components/library/PortalRunIdDropdown';
import { Link, useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
import { WorkflowVersion } from '../../components/library/WorkflowVersion';
import { FileAPITable, getTableColumn } from '@/modules/files/components/FileAPITable';
import { classNames } from '@/utils/commonUtils';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function LibraryWorkflowPage() {
  const { libraryOrcabusId, portalRunId, workflowType } = useParams();
  if (!libraryOrcabusId || !workflowType) {
    throw new Error('Invalid URL!');
  }

  return (
    <div>
      {/* Header */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row'>
          <h1 className='flex h-full items-center font-bold'>{`${workflowType}`}</h1>
          {portalRunId && (
            <WorkflowVersion portalRunId={portalRunId} libraryOrcabusId={libraryOrcabusId} />
          )}
        </div>

        <div className='flex flex-row '>
          <Link
            to={`/runs/workflow?search=${portalRunId}`}
            className={classNames('text-sm font-medium hover:text-blue-700 mt-4')}
          >
            <div className='items-center mr-4'>
              <DocumentMagnifyingGlassIcon className='h-5 w-5' />
            </div>
          </Link>
          <PortalRunIdDropdown
            workflowType={workflowType}
            portalRunId={portalRunId}
            libraryOrcabusId={libraryOrcabusId}
          />
        </div>
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
