/* eslint-disable */
import { FC, ReactNode, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { classNames } from '@/utils/commonUtils';
import { BackdropWithText } from '@/components/common/backdrop';

interface JsonToNestedListProps {
  title?: string;
  subtitle?: string;
  data: Record<string, any> | null;
  isFetchingData: boolean;
  inCard?: boolean;
  cellValueFormat?: {
    condition: (value: string) => boolean;
    cell: (value: string) => ReactNode;
  };
}

const JsonToNestedList: FC<JsonToNestedListProps> = ({
  title,
  subtitle,
  data,
  isFetchingData,
  inCard = true,
  cellValueFormat,
}) => {
  const [listData, setListData] = useState<Record<string, any> | null>(data);
  useEffect(() => {
    setListData(data);
  }, [data]);

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <ul className='list-disc space-y-1 pl-4'>
          {value.map((item, index) => (
            <li key={index} className='dark:text-gray-300'>
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <dl className='divide-y divide-gray-100 dark:divide-gray-700'>
          {Object.entries(value).map(([key, val], index) => (
            <div
              key={index}
              className='px-4 py-2 transition-colors sm:grid sm:grid-cols-5 sm:gap-4 sm:px-0'
            >
              <dt className='text-pretty break-words text-sm font-medium text-gray-900 dark:text-gray-100'>
                {key}
              </dt>
              <dd className='mt-1 break-words text-sm text-gray-600 sm:col-span-4 sm:mt-0 dark:text-gray-300'>
                {renderValue(val)}
              </dd>
            </div>
          ))}
        </dl>
      );
    } else if (cellValueFormat && cellValueFormat.condition(value)) {
      return cellValueFormat.cell(value);
    } else {
      return <span className='break-words dark:text-gray-300'>{value}</span>;
    }
  };

  if (!listData && isFetchingData) {
    return (
      <div className='space-y-4'>
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
    <div className='space-y-4'>
      <div className='px-4 sm:px-0'>
        {title && (
          <h3 className='text-lg font-semibold leading-7 text-gray-900 dark:text-white'>{title}</h3>
        )}
        {subtitle && (
          <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400'>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={classNames(
          'relative bg-white transition-colors dark:bg-gray-900',
          inCard
            ? 'overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700'
            : ''
        )}
      >
        {listData && isFetchingData ? (
          <BackdropWithText text='Loading data...' isVisible={true} />
        ) : null}
        <div
          className={classNames(
            'px-4',
            inCard ? '' : 'border-t border-gray-100 sm:px-0 dark:border-gray-800'
          )}
        >
          {listData ? (
            renderValue(listData)
          ) : (
            <div className='px-4 py-6 text-center sm:px-0'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>No data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonToNestedList;
