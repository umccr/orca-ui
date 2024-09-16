import { useState, useEffect, FC } from 'react';
import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/common/buttons';
import { SelectItems, IconMultipleSelect } from '@/components/common/select';
import { DateRangePicker } from '@/components/common/datepicker';
import { Toggle } from '@/components/common/toggles';
import { Tooltip } from '@/components/common/tooltips';

interface WorkflowRunTableHeaderProps {
  setQueryParams: (
    params: Record<string, string | number | boolean | (string | number)[] | null>
  ) => void;
  searchBoxContent: string;
  workflowTypeLists: SelectItems[];
  isOngoingOnly: boolean;
  clearQueryParams: () => void;
  queryWorkflowTypeIdsStr: string;
  handleSelectWorkflowType: (value: (string | number)[]) => void;
  handleOngoingOnlyToggle: (value: boolean) => void;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
}

const WorkflowRunTableHeader: FC<WorkflowRunTableHeaderProps> = ({
  setQueryParams,
  searchBoxContent,
  workflowTypeLists,
  queryWorkflowTypeIdsStr,
  isOngoingOnly,
  handleSelectWorkflowType,
  handleOngoingOnlyToggle,
  clearQueryParams,
  selectedStartDate,
  selectedEndDate,
}) => {
  const [searchBox, setSearchBox] = useState<string>('');
  const [selectWorkflowTypeIdsStr, setSelectWorkflowTypeIdsStr] =
    useState<string>(queryWorkflowTypeIdsStr);
  const [workflowTypeOptions, setWorkflowTypeOptions] = useState<SelectItems[]>([]);
  const [isToggleChecked, setIsToggleChecked] = useState<boolean>(isOngoingOnly);

  useEffect(() => {
    setSearchBox(searchBoxContent || '');
    setWorkflowTypeOptions(workflowTypeLists);

    setSelectWorkflowTypeIdsStr(queryWorkflowTypeIdsStr);

    setIsToggleChecked(isOngoingOnly);
  }, [workflowTypeLists, queryWorkflowTypeIdsStr, searchBoxContent, isOngoingOnly]);

  return (
    <div className='w-full flex flex-row gap-1  md:flex-row items-center  justify-between px-4 py-2'>
      <div className='flex flex-row items-center'>
        <div className='flex-1 '>
          <label htmlFor='search' className='sr-only'>
            Search
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchBox) {
                    setQueryParams({ search: searchBox });
                  } else {
                    setQueryParams({ search: null });
                  }
                }
              }}
              onChange={(e) => {
                setSearchBox(e.target.value.trim());
              }}
              value={searchBox}
              id='search'
              name='search'
              className='block w-full h-8 rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Search'
              type='search'
            />
          </div>
        </div>
        <Tooltip
          text='Available Search Items:  workflowRunName, comment, libraryId, orcabusId, workflowName'
          position='top'
          background='white'
        >
          <QuestionMarkCircleIcon className='h-6 w-6 text-slate-300 pl-1' />
        </Tooltip>
      </div>

      {/* <div className='px-4 text-sm flex-2'>
        <div className='flex flex-row items-center'>
          <div className='px-2 text-nowrap'>Workflow Type</div>
          <Select
            // id='select'
            options={workflowTypeOptions}
            value={{
              value: selectWorkflowType.value,
              label: selectWorkflowType.label,
              secondaryLabel: selectWorkflowType.secondaryLabel,
            }}
            onChange={handleSelectWorkflowType}
          />
        </div>
      </div> */}
      <div className='flex flex-row items-center'>
        <div className='flex-none'>
          <DateRangePicker
            align='left'
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            setQueryParams={setQueryParams}
          />
        </div>
        <div className='w-fit px-2 flex-none'>
          <Toggle
            label='ongoing only'
            onChange={handleOngoingOnlyToggle}
            checked={isToggleChecked}
          />
        </div>
        <IconMultipleSelect
          options={workflowTypeOptions}
          value={selectWorkflowTypeIdsStr.split(',')}
          onApply={handleSelectWorkflowType}
        />
        <div className='px-2 flex-none'>
          <Button
            size='sm'
            onClick={() => {
              clearQueryParams();
              setSearchBox('');
            }}
            className=' text-sm text-gray-400 hover:text-white'
          >
            reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunTableHeader;
