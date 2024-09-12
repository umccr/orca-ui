import { useState, useEffect, FC } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/common/buttons';
import { Select, SelectItems } from '@/components/common/select';
import { DateRangePicker } from '@/components/common/datepicker';
import { Toggle } from '@/components/common/toggles';

interface WorkflowRunTableHeaderProps {
  setQueryParams: (params: Record<string, string | number | boolean | null>) => void;
  searchBoxContent: string;
  workflowTypeLists: SelectItems[];
  isOngoingOnly: boolean;
  clearQueryParams: () => void;
  queryWorkflowTypeId: string | null;
  handleSelectWorkflowType: (value: SelectItems) => void;
  handleOngoingOnlyToggle: (value: boolean) => void;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
}

const WorkflowRunTableHeader: FC<WorkflowRunTableHeaderProps> = ({
  setQueryParams,
  searchBoxContent,
  workflowTypeLists,
  queryWorkflowTypeId,
  isOngoingOnly,
  handleSelectWorkflowType,
  handleOngoingOnlyToggle,
  clearQueryParams,
  selectedStartDate,
  selectedEndDate,
}) => {
  const [searchBox, setSearchBox] = useState<string>('');
  const [selectWorkflowTypeId, setSelectWorkflowTypeId] = useState<string | null>('-1');
  const [workflowTypeOptions, setWorkflowTypeOptions] = useState<SelectItems[]>([]);
  const [isToggleChecked, setIsToggleChecked] = useState<boolean>(isOngoingOnly);

  useEffect(() => {
    setSearchBox(searchBoxContent || '');
    setWorkflowTypeOptions(workflowTypeLists);
    setSelectWorkflowTypeId(queryWorkflowTypeId);
    setIsToggleChecked(isOngoingOnly);
  }, [workflowTypeLists, queryWorkflowTypeId, searchBoxContent, isOngoingOnly]);

  const selectWorkflowType = workflowTypeOptions.find(
    (option) => option.value === selectWorkflowTypeId
  ) || {
    value: '-1',
    label: 'All workflow',
    secondaryLabel: '',
  };

  // console.log(
  //   'WorkflowRunTableHeaderProps',
  //   searchBoxContent,
  //   workflowTypeLists,
  //   queryWorkflowTypeId,
  //   selectWorkflowType
  // );

  return (
    <div className='w-full flex flex-row gap-2 justify-start md:flex-row items-center px-4 py-2'>
      <div className=' md:max-w-xs'>
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
            className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='Search '
            type='search'
          />
        </div>
      </div>
      <div className='px-4 flex flex-row text-sm items-center  md:max-w-xs'>
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
      <div className='pl-20 pr-10'>
        <Toggle label='ongoing only' onChange={handleOngoingOnlyToggle} checked={isToggleChecked} />
      </div>
      <div>
        <DateRangePicker
          align='left'
          startDate={selectedStartDate}
          endDate={selectedEndDate}
          setQueryParams={setQueryParams}
        />
      </div>
      <div className='px-20'>
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
  );
};

export default WorkflowRunTableHeader;
