import { LibraryListAPITable } from '@/modules/lab/components/library/LibraryListAPITable';
import { SubjectListAPITable } from '../components/subject/SubjectListAPITable';
import { Fragment, Suspense } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import { useQueryParams } from '@/hooks/useQueryParams';
import { IndividualListAPITable } from '../components/individual/IndividualListAPITable';
import { SampleListAPITable } from '../components/sample/SampleListAPITable';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/buttons';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { ProjectListAPITable } from '../components/project/ProjectListAPITable';

const selectedClassName =
  'inline-flex items-center gap-2 p-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 rounded-t-lg font-medium transition-colors duration-200';
const regularClassName =
  'inline-flex items-center gap-2 p-4 text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg cursor-pointer transition-all duration-200';

export default function MetadataPage() {
  const { getQueryParams, setQueryParams } = useQueryParams();
  const navigate = useNavigate();
  const queryParams = getQueryParams();

  const currentTabSelection = queryParams.tab;

  // sanitise to remove tab from query params
  const passInQueryParams = { ...queryParams };
  delete passInQueryParams.tab;

  const tabs = [
    {
      label: 'library',
      content: <LibraryListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'subject',
      content: <SubjectListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'individual',
      content: <IndividualListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'sample',
      content: <SampleListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'project',
      content: <ProjectListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'MODEL',
      content: (
        <div className='flex justify-center rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-800/50'>
          <img
            alt='Metadata Schema'
            src='/assets/metadata-schema.svg'
            className='h-auto max-w-full'
          />
        </div>
      ),
    },
  ];

  if (!currentTabSelection || !tabs.map((tab) => tab.label).includes(currentTabSelection)) {
    return <Navigate to='/lab?tab=library' replace />;
  }

  return (
    <div>
      <div className='flex items-center justify-end'>
        <Button
          onClick={() => navigate('./sync')}
          type='green'
          size='sm'
          className='shadow-sm ring-1 ring-green-600/20 transition-shadow duration-200 hover:shadow-md dark:ring-green-400/20'
          tooltip='Import metadata'
        >
          <span className='flex items-center gap-2'>
            Import
            <DocumentArrowUpIcon className='h-5 w-5' />
          </span>
        </Button>
      </div>

      <div className='rounded-lg bg-white dark:bg-gray-900'>
        <div className='border-b border-gray-200 text-sm font-medium dark:border-gray-700'>
          <ul className='-mb-px flex flex-wrap'>
            {tabs.map((tab, index) => {
              const isSelected = currentTabSelection === tab.label;
              return (
                <li key={index}>
                  <div
                    onClick={() => setQueryParams({ tab: tab.label }, true)}
                    className={isSelected ? selectedClassName : regularClassName}
                  >
                    {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='mt-2 px-2'>
          {tabs.map((tab, index) => {
            if (currentTabSelection === tab.label) {
              return (
                <Fragment key={index}>
                  <Suspense fallback={<SpinnerWithText />}>{tab.content}</Suspense>
                </Fragment>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
