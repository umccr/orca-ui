import { ChevronRightIcon } from '@heroicons/react/20/solid';

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
];

const Breadcrumb = () => {
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
                className='ml-4 text-sm font-medium text-blue-500 hover:text-blue-700'
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
