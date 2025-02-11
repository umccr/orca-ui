import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LocationBreadcrumb: FC = () => {
  // const { pages } = props;

  let fullPath = useLocation().pathname;
  let lastSlashIndex = fullPath.lastIndexOf('/');

  // Remove leading slash ('/')
  if (fullPath[0] == '/') {
    fullPath = fullPath.substring(1, fullPath.length);
    lastSlashIndex = fullPath.lastIndexOf('/');
  }

  // Remove trailing slash ('/')
  if (lastSlashIndex == fullPath.length - 1) {
    fullPath = fullPath.substring(0, lastSlashIndex);
    lastSlashIndex = fullPath.lastIndexOf('/');
  }

  const splitPath = fullPath.split('/');
  const currentPage = splitPath[splitPath.length - 1];
  return (
    <nav
      className='mb-6 flex border-b border-gray-200 pb-3 transition-colors duration-200 dark:border-gray-700'
      aria-label='Breadcrumb'
    >
      <ol
        role='list'
        className='scrollbar-hide -ml-2 flex max-w-full flex-wrap items-center space-x-2 overflow-x-auto'
      >
        {splitPath.map((path, key) => (
          <li key={key}>
            <div className='flex items-center'>
              {key > 0 && (
                <ChevronRightIcon
                  className='h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-600'
                  aria-hidden='true'
                />
              )}
              <Link
                to={`/${splitPath.slice(0, key + 1).join('/')}`}
                className={classNames(
                  'ml-2 text-sm font-medium transition-colors duration-200',
                  'hover:text-blue-600 dark:hover:text-blue-400',
                  currentPage === path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400',
                  'max-w-[150px] truncate sm:max-w-[200px] md:max-w-none'
                )}
                aria-current={currentPage === path ? 'page' : undefined}
              >
                {path}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default LocationBreadcrumb;
