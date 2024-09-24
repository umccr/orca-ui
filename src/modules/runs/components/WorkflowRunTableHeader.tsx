import { FC } from 'react';
import { Button } from '@/components/common/buttons';
import { SelectItems, IconMultipleSelect } from '@/components/common/select';
import { DateRangePicker } from '@/components/common/datepicker';
import { Search } from '@/components/common/search';
import WorkflowRunTableStatusBar from './WorkflowRunTableStatusBar';

interface WorkflowRunTableHeaderProps {
  setQueryParams: (
    params: Record<string, string | number | boolean | (string | number)[] | null>
  ) => void;
  searchBoxContent: string;
  workflowTypeLists: SelectItems[];
  workflowStatus: 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null;
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
  workflowStatus,
  handleSelectWorkflowType,
  clearQueryParams,
  selectedStartDate,
  selectedEndDate,
}) => {
  return (
    <div>
      <div className='w-full flex flex-row gap-1  md:flex-row items-center  justify-between p-2'>
        <div>
          <Search
            onSearch={(searchContent) => setQueryParams({ search: searchContent })}
            searchBoxContent={searchBoxContent}
            hasTooltip
          />
        </div>

        <div className='flex flex-row items-center gap-2'>
          <div className='flex-none'>
            <DateRangePicker
              align='left'
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              setQueryParams={setQueryParams}
            />
          </div>
          {/* <div className='w-fit px-2 flex-none'>
          <Toggle
            label='ongoing only'
            onChange={handleOngoingOnlyToggle}
            checked={isToggleChecked}
          />
        </div> */}
          <div className='px-0'>
            <IconMultipleSelect
              options={workflowTypeLists}
              selectedItemValues={queryWorkflowTypeIdsStr.split(',')}
              onApply={handleSelectWorkflowType}
              hasSelectAllOption={true}
              selectAllOptionValue='-1'
            />
          </div>

          <div className='px-0 flex-none'>
            <Button
              size='md'
              onClick={() => {
                clearQueryParams();
              }}
              className=' text-gray-400 hover:text-white'
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>
      <div>
        <WorkflowRunTableStatusBar
          selectedWorkflowRunStatus={workflowStatus}
          setQueryParams={setQueryParams}
        />
      </div>
    </div>
  );
};

export default WorkflowRunTableHeader;
