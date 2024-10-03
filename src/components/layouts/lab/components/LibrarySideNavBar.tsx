import { ModuleNavbar } from '@/components/navigation/navbar';
import { useLocation, useParams } from 'react-router-dom';
import { useSuspenseWorkflowModel } from '@/api/workflow';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';

export const LibrarySideNavBar = () => {
  const { libraryId, portalRunId } = useParams();
  const { pathname } = useLocation();

  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const baseHref = `/lab/library/${libraryId}`;

  const workflow = useSuspenseWorkflowModel({
    params: {
      query: {
        workflowrun__libraries__libraryId: libraryId,
        ordering: 'id',
        rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE,
      },
    },
  }).data;

  // A temporary array just to make the workflow array distinct
  const workflowNameSet = new Set<string>();

  return (
    <ModuleNavbar
      navigation={[
        {
          title: 'Library',
          children: [{ name: 'Overview', href: `${baseHref}` }],
        },
        {
          title: 'Workflows',
          children:
            workflow?.results
              .map((wf) => ({
                name: `${wf.workflowName}`,
                href: `${baseHref}/${wf.workflowName}`,
                // We wanted to know if the workflow name is selected in the NavBar
                isCurrent: portalRunId
                  ? pathname.split(portalRunId)[0].endsWith(`${wf.workflowName}/`)
                  : undefined,
              }))
              // Filter out duplicate workflows
              .filter((wf) => {
                if (workflowNameSet.has(wf.name)) {
                  return false;
                } else {
                  workflowNameSet.add(wf.name);
                  return true;
                }
              }) ?? [],
        },
      ]}
      // In case workflow return is beyond the first page, at least some warning as we do not have pagination implemented
      footer={
        workflow?.links?.next ? (
          <div className='p-4 text-slate-400 text-xs italic'>
            *Some workflows may not be listed.
          </div>
        ) : undefined
      }
    />
  );
};
