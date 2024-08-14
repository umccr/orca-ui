import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useMetadataFullLibraryModel } from '@/api/metadata';

export const LibraryBreadCrumb: FC = () => {
  const { pathname } = useLocation();
  const { libraryId, workflowType, portalRunId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const fullLibraryModel = useMetadataFullLibraryModel({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { internal_id: libraryId } as any },
  }).data;

  if (!fullLibraryModel || fullLibraryModel.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }
  const library = fullLibraryModel.results[0];
  const subjectId = library.specimen.subject.internal_id;

  const libraryBreadCrumbProps = [
    { name: 'SUBJECT', href: '/lab', isCurrent: false },
    { name: subjectId ?? '-', href: `/lab/subject/${subjectId}`, isCurrent: false },
    { name: 'LIBRARY', href: '/lab', isCurrent: false },
    {
      name: library.internal_id,
      href: `/lab/library/${library.internal_id}`,
      isCurrent: library.internal_id ? pathname.endsWith(library.internal_id) : false,
    },
  ];

  if (workflowType) {
    libraryBreadCrumbProps.push({
      name: workflowType,
      href: `/lab/library/${library.internal_id}/${workflowType}`,
      isCurrent: pathname.endsWith(workflowType),
    });

    if (portalRunId) {
      libraryBreadCrumbProps.push({
        name: portalRunId,
        href: `/lab/library/${library.internal_id}/${workflowType}/${portalRunId}`,
        isCurrent: pathname.endsWith(portalRunId),
      });
    }
  }

  return (
    <nav className='flex' aria-label='Breadcrumb'>
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
