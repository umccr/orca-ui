import { FC, FunctionComponent, SVGProps } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/commonUtils';

export interface StatsCardsProps {
  header: string;
  items: {
    name: string;
    stat: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    changeType?: 'increase' | 'decrease';
    change?: string;
  }[];
}

const StatsCards: FC<StatsCardsProps> = ({ header, items }) => {
  return (
    <div>
      {header && <h3 className='text-base font-semibold leading-6 text-gray-900'>{header}</h3>}
      <dl className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4'>
        {items.map((item, index) => (
          <div
            key={index}
            className='relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6'
          >
            <dt>
              <div className='absolute rounded-md bg-indigo-500 p-3'>
                <item.icon className='h-6 w-6 text-white' aria-hidden='true' />
              </div>
              <p className='ml-16 truncate text-sm font-medium text-gray-500'>{item.name}</p>
            </dt>
            <dd className='ml-16 flex items-baseline pb-6 sm:pb-7'>
              <p className='text-2xl font-semibold text-gray-900'>{item.stat}</p>
              {item.changeType && (
                <p
                  className={classNames(
                    item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <ArrowUpIcon
                      className='h-5 w-5 flex-shrink-0 self-center text-green-500'
                      aria-hidden='true'
                    />
                  ) : (
                    <ArrowDownIcon
                      className='h-5 w-5 flex-shrink-0 self-center text-red-500'
                      aria-hidden='true'
                    />
                  )}

                  <span className='sr-only'>
                    {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by{' '}
                  </span>
                  {item.change}
                </p>
              )}
              <div className='absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6'>
                <div className='text-sm'>
                  <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                    View deatails<span className='sr-only'> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default StatsCards;
