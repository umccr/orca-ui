import { FC, useEffect, useState } from 'react';

interface JsonToListProps {
  title?: string;
  subtitle?: string;
  data: Record<string, string | null>;
}

const JsonToList: FC<JsonToListProps> = ({ title, subtitle, data }) => {
  const [listData, setListData] = useState<Record<string, string | null>>(data);
  useEffect(() => {
    setListData(data);
  }, [data]);
  return (
    <div>
      <div className='px-4 sm:px-0'>
        {title && <p className='text-base font-semibold leading-7 text-gray-900 pt-4'>{title}</p>}
        {subtitle && <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500'>{subtitle}</p>}
      </div>
      <div className='border-t border-gray-100'>
        <dl className='divide-y divide-gray-100'>
          {Object.entries(listData).map(([key, value], index) => (
            <div key={index} className='px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
              <dt className='mt-1 text-sm font-medium leading-6 text-gray-900'>{key}</dt>
              <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default JsonToList;
