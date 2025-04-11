import { FC, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface ExternalLinkProps {
  children: ReactNode;
  url: string;
  className?: string;
  linkBtnClassName?: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({ children, url, className, linkBtnClassName }) => {
  return (
    <div className={classNames('flex items-center gap-2', className)}>
      {children}
      <button
        onClick={() => window.open(url, '_blank')}
        className={classNames(
          'rounded-md p-1',
          'text-gray-500 hover:text-gray-700',
          'dark:text-gray-400 dark:hover:text-gray-200',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          'transition-all duration-200',
          linkBtnClassName
        )}
        title='Open in new tab'
      >
        <ArrowTopRightOnSquareIcon className='h-4 w-4' />
      </button>
    </div>
  );
};

export default ExternalLink;
