import { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { classNames } from '@/utils/commonUtils';

interface JsonToListProps {
  title?: string;
  subtitle?: string;
  data: Record<string, string | null> | null;
  isFetchingData: boolean;
  inCard?: boolean;
}

const JsonToList: FC<JsonToListProps> = ({
  title,
  subtitle,
  data,
  isFetchingData,
  inCard = true,
}) => {
  const [listData, setListData] = useState<Record<string, string | null> | null>(data);
  useEffect(() => {
    setListData(data);
  }, [data]);

  if (isFetchingData) {
    return (
      <div className='w-full'>
        <div className='px-4 sm:px-0'>
          <Skeleton className='h-7 w-full dark:bg-gray-700' />
        </div>
        <div>
          <Skeleton count={8} className='dark:bg-gray-700' />
        </div>
      </div>
    );
  }
  return (
    <div className='w-full'>
      <div className='px-4 pb-4 sm:px-0'>
        {title && (
          <h3 className='text-lg leading-7 font-semibold text-gray-900 dark:text-gray-100'>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400'>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={classNames(
          'bg-white dark:bg-gray-800',
          inCard
            ? 'overflow-hidden rounded-lg border border-gray-200 shadow-xs dark:border-gray-700'
            : ''
        )}
      >
        <div
          className={classNames(
            'px-4',
            inCard ? '' : 'border-t border-gray-200 sm:px-0 dark:border-gray-700'
          )}
        >
          <dl className='divide-y divide-gray-200 dark:divide-gray-700'>
            {listData ? (
              Object.entries(listData).map(([key, value], index) => (
                <div key={index} className='px-4 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                  <dt className='text-sm leading-5 font-medium text-gray-900 dark:text-gray-200'>
                    {key}
                  </dt>
                  <dd className='mt-1 text-sm leading-5 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-300'>
                    {value}
                  </dd>
                </div>
              ))
            ) : (
              <div className='px-4 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm leading-5 font-medium text-gray-500 dark:text-gray-400'>
                  No data found
                </dt>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default JsonToList;
