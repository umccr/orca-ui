import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/utils';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMetadataFullLibraryModel } from '@/api/metadata';

export const LibraryBreadCrumb: FC = () => {
  const { libraryId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const fullLibraryModel = useMetadataFullLibraryModel({
    params: { query: { internal_id: libraryId } },
  }).data;

  if (!fullLibraryModel || fullLibraryModel.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }
  const library = fullLibraryModel.results[0];
  const subjectId = library.specimen.subject.internal_id;

  const libraryBreadCrumbProps = [
    { name: 'lab', href: '/lab', isCurrent: false },
    { name: 'subject', href: '/lab' },
    { name: subjectId ?? '-', href: `/lab/subject/${subjectId}`, isCurrent: false },
    { name: 'library', href: '/lab', isCurrent: false },
    { name: library.internal_id, href: `/lab/library/${library.internal_id}`, isCurrent: true },
  ];

  return (
    <nav className='flex mb-3' aria-label='Breadcrumb'>
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
                  'ml-2 text-sm uppercase font-medium hover:text-blue-700',
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
