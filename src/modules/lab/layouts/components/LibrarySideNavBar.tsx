import { ModuleNavbar } from '@/components/navigation/navbar';
import { useLocation, useParams } from 'react-router-dom';
import { useSuspenseWorkflowModel } from '@/api/workflow';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { HomeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { WorkflowIcon } from '@/components/icons/WorkflowIcon';
// import { getWorkflowIcon } from '@/utils/workflows';

export const LibrarySideNavBar = () => {
  const { libraryOrcabusId, portalRunId } = useParams();
  const { pathname } = useLocation();

  if (!libraryOrcabusId) {
    throw new Error('No library id in URL path!');
  }

  const baseHref = `/lab/library/${libraryOrcabusId}`;
  const workflow = useSuspenseWorkflowModel({
    params: {
      query: {
        workflowrun__libraries__orcabusId: libraryOrcabusId,
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
          children: [
            {
              name: 'Overview',
              href: `${baseHref}/overview`,
              icon: HomeIcon,
            },
            {
              name: 'Workflow Runs',
              href: `${baseHref}/workflow-runs`,
              icon: WorkflowIcon,
            },
            {
              name: 'History',
              href: `${baseHref}/history`,
              icon: ClockIcon,
            },
          ],
        },
        {
          title: 'Workflows',
          children:
            workflow?.results
              .map((wf) => ({
                name: `${wf.name}`,
                href: `${baseHref}/${wf.name}`,
                isCurrent: portalRunId
                  ? pathname.split(portalRunId)[0].endsWith(`${wf.name}/`)
                  : // In case trailing slash in pathname
                    pathname.endsWith(`${wf.name}/`) || pathname.endsWith(`${wf.name}`),
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
          <div className='p-4 text-xs text-slate-400 italic'>
            *Some workflows may not be listed.
          </div>
        ) : undefined
      }
      preferenceStorageKey='library-module-navbar'
    />
  );
};
