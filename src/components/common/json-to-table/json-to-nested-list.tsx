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
        <ul className='list-disc pl-4'>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <dl className='divide-y divide-gray-100'>
          {Object.entries(value).map(([key, val], index) => (
            <div key={index} className='px-4 py-1 sm:grid sm:grid-cols-4 sm:gap-1 sm:px-0'>
              <dt className='mt-1 text-sm font-medium leading-6 text-gray-900 text-pretty break-words'>
                {key}
              </dt>
              <dd className='mt-1 text-sm leading-6 text-gray-600 break-words sm:col-span-3 '>
                {renderValue(val)}
              </dd>
            </div>
          ))}
        </dl>
      );
    } else if (cellValueFormat && cellValueFormat.condition(value)) {
      return cellValueFormat.cell(value);
    } else {
      return <span className='break-words'>{value}</span>;
    }
  };

  if (!listData && isFetchingData) {
    return (
      <div>
        <div className='px-4 sm:px-0'>
          <Skeleton className='h-7 w-full' />
        </div>
        <div>
          <Skeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='px-4 pb-2 sm:px-0'>
        {title && <p className='text-base font-semibold leading-7 text-gray-900'>{title}</p>}
        {subtitle && <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500'>{subtitle}</p>}
      </div>
      <div
        className={classNames(
          'relative',
          inCard ? 'overflow-hidden border-2 border-black border-opacity-5 sm:rounded-lg' : ''
        )}
      >
        {listData && isFetchingData ? (
          <BackdropWithText text='Loading data...' isVisible={true} />
        ) : null}
        <div className={classNames('px-4', inCard ? '' : 'sm:px-0 border-t border-gray-100')}>
          {listData ? (
            renderValue(listData)
          ) : (
            <div className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='mt-1 text-sm font-medium leading-6 text-gray-900'>No data found</dt>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonToNestedList;
