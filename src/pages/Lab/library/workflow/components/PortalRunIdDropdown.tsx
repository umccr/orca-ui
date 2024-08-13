import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from '@/components/common/dropdowns';
import { useWorkflowrunModel } from '@/api/workflow';

export const PortalRunIdDropdown = () => {
  const navigate = useNavigate();
  const { libraryId, portalRunId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const workflowRun = useWorkflowrunModel({
    // Disable until libraryId annotation is added to the workflow model (below only return mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { libraryId: libraryId, ordering: '-portalRunId' } as any },
    // sort by desc portalRunId and index first element to get latest run
  }).data.results;

  if (!portalRunId) {
    return <Navigate to={`${workflowRun[0].portalRunId}`} />;
  }

  return (
    <div className='flex flex-row font-medium'>
      <div className='flex flex-wrap content-center'>
        <Dropdown
          floatingLabel='Portal Run Id'
          value={portalRunId}
          items={workflowRun.map((i) => ({
            label: i.portalRunId,
            onClick: () => navigate(`../${i.portalRunId}`),
          }))}
        />
      </div>
    </div>
  );
};
