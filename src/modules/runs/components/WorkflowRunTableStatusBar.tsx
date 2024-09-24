import { FC, useEffect, useState } from 'react';
import { classNames } from '@/utils/commonUtils';
import { useWorkflowRunStatusCountModel } from '@/api/workflow';

interface WorkflowRunTableStatusBarProps {
  selectedWorkflowRunStatus: 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null;
  setQueryParams: (params: Record<string, string | number | boolean | null>) => void;
}

const WorkflowRunTableStatusBar: FC<WorkflowRunTableStatusBarProps> = ({
  selectedWorkflowRunStatus,
  setQueryParams,
}) => {
  const [selectWorkflowRunStatus, setSelectWorkflowRunStatus] = useState(selectedWorkflowRunStatus);

  useEffect(() => {
    selectWorkflowRunStatus !== selectedWorkflowRunStatus &&
      setSelectWorkflowRunStatus(selectedWorkflowRunStatus);
  }, [selectWorkflowRunStatus, selectedWorkflowRunStatus]);

  const { data: workflowRunStatusCountData } = useWorkflowRunStatusCountModel({
    params: {},
  });

  // const workflowRunStatusCountData = workflowRunStatusCountModel.data;
  if (!workflowRunStatusCountData) {
    console.log('No workflow status count Data');
  }

  const baseClassName =
    'inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out';

  return (
    <ul className='flex flex-wrap px-2 py-1'>
      {/* <li className='m-1'>
        <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out'>
          All <span className='ml-1 text-indigo-200'>67</span>
        </button>
      </li> */}

      <li className='m-1'>
        <button
          className={classNames(
            baseClassName,
            selectWorkflowRunStatus == null ? 'bg-indigo-500 text-white' : 'bg-white'
          )}
          onClick={() => {
            setQueryParams({ workflowRunStatus: null });
          }}
        >
          All{' '}
          <span
            className={classNames(
              'ml-2',
              selectWorkflowRunStatus == null
                ? 'text-indigo-200'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {workflowRunStatusCountData?.all}
          </span>
        </button>
      </li>

      <li className='m-1'>
        <button
          className={classNames(
            baseClassName,
            selectWorkflowRunStatus == 'succeeded' ? 'bg-indigo-500 text-white' : 'bg-white'
          )}
          onClick={() => {
            setQueryParams({ workflowRunStatus: 'succeeded' });
          }}
        >
          Succeeded{' '}
          <span
            className={classNames(
              'ml-2',
              selectWorkflowRunStatus == 'succeeded'
                ? 'text-indigo-200'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {workflowRunStatusCountData?.succeeded}
          </span>
        </button>
      </li>
      <li className='m-1'>
        <button
          className={classNames(
            baseClassName,
            selectWorkflowRunStatus == 'failed' ? 'bg-indigo-500 text-white' : 'bg-white'
          )}
          onClick={() => {
            setQueryParams({ workflowRunStatus: 'failed' });
          }}
        >
          Failed{' '}
          <span
            className={classNames(
              'ml-2',
              selectWorkflowRunStatus == 'failed'
                ? 'text-indigo-200'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {workflowRunStatusCountData?.failed}
          </span>
        </button>
      </li>
      <li className='m-1'>
        <button
          className={classNames(
            baseClassName,
            selectWorkflowRunStatus == 'aborted' ? 'bg-indigo-500 text-white' : 'bg-white'
          )}
          onClick={() => {
            setQueryParams({ workflowRunStatus: 'aborted' });
          }}
        >
          Aborted{' '}
          <span
            className={classNames(
              'ml-2',
              selectWorkflowRunStatus == 'aborted'
                ? 'text-indigo-200'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {workflowRunStatusCountData?.aborted}
          </span>
        </button>
      </li>
      <li className='m-1'>
        <button
          className={classNames(
            baseClassName,
            selectWorkflowRunStatus == 'ongoing' ? 'bg-indigo-500 text-white' : 'bg-white'
          )}
          onClick={() => {
            setQueryParams({ workflowRunStatus: 'ongoing' });
          }}
        >
          Ongoing{' '}
          <span
            className={classNames(
              'ml-2',
              selectWorkflowRunStatus == 'ongoing'
                ? 'text-indigo-200'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {workflowRunStatusCountData?.ongoing}
          </span>
        </button>
      </li>
    </ul>
  );
};
export default WorkflowRunTableStatusBar;
