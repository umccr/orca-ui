import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/utils';
import { FC } from 'react';

export type BreadcrumbProps = {
  pages: {
    name: string;
    href: string;
    current: boolean;
  }[];
};

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { pages } = props;
  return (
    <nav className='flex' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        {pages.map((page, key) => (
          <li key={key}>
            <div className='flex items-center'>
              {key != 0 && (
                <ChevronRightIcon
                  className='h-5 w-5 flex-shrink-0 text-gray-400'
                  aria-hidden='true'
                />
              )}
              <a
                href={page.href}
                className={classNames(
                  'ml-4 text-sm font-medium hover:text-blue-700',
                  page.current ? 'text-blue-500' : 'text-grey-500'
                )}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
