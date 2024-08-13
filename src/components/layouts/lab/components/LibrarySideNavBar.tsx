import React from 'react';
import { ModuleNavbar } from '@/components/navigation/navbar';
import { useParams } from 'react-router-dom';
import { useWorkflowModel } from '@/api/workflow';

export const LibrarySideNavBar = () => {
  const { libraryId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const baseHref = `/lab/library/${libraryId}`;

  const workflow = useWorkflowModel({
    // Disable until libraryId annotation is added to the workflow model (below only return mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { libraryId: libraryId } as any },
  }).data;

  return (
    <ModuleNavbar
      navigation={[
        {
          name: 'Library',
          children: [{ name: 'Overview', href: `${baseHref}` }],
        },
        {
          name: 'Workflows',
          children: workflow.results.map((wf) => ({
            name: `${wf.workflowName}`,
            href: `${baseHref}/${wf.workflowName}`,
          })),
        },
      ]}
    />
  );
};
