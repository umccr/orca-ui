import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSuspenseMetadataLibraryModel } from '@/api/metadata';

export const LibraryBreadCrumb: FC = () => {
  const { pathname } = useLocation();
  const { libraryOrcabusId, workflowType, portalRunId } = useParams();
  if (!libraryOrcabusId) {
    throw new Error('No library orcabus Id in URL path!');
  }

  const fullLibraryModel = useSuspenseMetadataLibraryModel({
    params: { query: { orcabusId: libraryOrcabusId } },
  }).data;

  if (!fullLibraryModel || fullLibraryModel.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }
  const library = fullLibraryModel.results[0];
  const subject = library.subject;

  const libraryBreadCrumbProps = [
    { name: 'SUBJECT', href: '/lab', isCurrent: false },
    {
      name: subject.subjectId ?? '-',
      href: `/lab/?tab=subject&orcabusId=${subject.orcabusId}`,
      isCurrent: false,
    },
    { name: 'LIBRARY', href: '/lab', isCurrent: false },
    {
      name: library.libraryId,
      href: `/lab/library/${library.orcabusId}`,
      isCurrent: library.orcabusId ? pathname.endsWith(library.orcabusId) : false,
    },
  ];

  if (workflowType) {
    libraryBreadCrumbProps.push({
      name: workflowType,
      href: `/lab/library/${library.orcabusId}/${workflowType}`,
      isCurrent: pathname.endsWith(workflowType),
    });

    if (portalRunId) {
      libraryBreadCrumbProps.push({
        name: portalRunId,
        href: `/lab/library/${library.orcabusId}/${workflowType}/${portalRunId}`,
        isCurrent: pathname.endsWith(portalRunId),
      });
    }
  }

  const isOverviewPage = pathname.endsWith('overview');
  if (isOverviewPage) {
    libraryBreadCrumbProps.push({
      name: 'OVERVIEW',
      href: `/lab/library/${library.orcabusId}/overview`,
      isCurrent: !!isOverviewPage,
    });
  }

  const isHistoryPage = pathname.endsWith('history');
  if (isHistoryPage) {
    libraryBreadCrumbProps.push({
      name: 'HISTORY',
      href: `/lab/library/${library.orcabusId}/history`,
      isCurrent: !!isHistoryPage,
    });
  }

  return (
    <nav className='flex overflow-auto' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-2 -ml-2'>
        {libraryBreadCrumbProps.map((p, key) => (
          <li key={key}>
            <div className='flex items-center'>
              {key != 0 && (
                <ChevronRightIcon
                  className='h-5 w-5 flex-shrink-0 text-gray-400'
                  aria-hidden='true'
                />
              )}
              <Link
                to={p.href}
                className={classNames(
                  'ml-2 text-sm font-medium hover:text-blue-700',
                  p.isCurrent ? 'text-blue-500' : 'text-grey-500'
                )}
                aria-current={p.isCurrent ? 'page' : undefined}
              >
                {p.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
