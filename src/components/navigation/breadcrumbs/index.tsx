import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

export type BreadcrumbProps = {
  pages: {
    name: string;
    href: string;
    current: boolean;
  }[];
};

const Breadcrumb: FC = () => {
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
    <nav className='flex mb-3' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-2 -ml-2'>
        {splitPath.map((path, key) => (
          <li key={key}>
            <div className='flex items-center'>
              {key != 0 && (
                <ChevronRightIcon
                  className='h-5 w-5 flex-shrink-0 text-gray-400'
                  aria-hidden='true'
                />
              )}
              <Link
                to={`/${splitPath.slice(0, key + 1).join('/')}`}
                className={classNames(
                  'ml-2 text-sm uppercase font-medium hover:text-blue-700',
                  currentPage == path ? 'text-blue-500' : 'text-grey-500'
                )}
                aria-current={currentPage == path ? 'page' : undefined}
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

export default Breadcrumb;
