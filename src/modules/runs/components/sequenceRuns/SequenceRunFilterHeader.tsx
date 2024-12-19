import { Search } from '@/components/common/search';
import { Button } from '@/components/common/buttons';
import { useQueryParams } from '@/hooks/useQueryParams';

const SequenceRunFilterHeader = () => {
  const { setQueryParams, clearQueryParams, getQueryParams } = useQueryParams();

  return (
    <>
      <div className='flex w-full flex-row items-center justify-between gap-1 p-2 md:flex-row'>
        <div>
          <Search
            onSearch={(searchContent) => setQueryParams({ search: searchContent })}
            searchBoxContent={getQueryParams().search || ''}
            hasTooltip={false}
          />
        </div>

        <div className='flex flex-row items-center gap-2'>
          {/* <div className='flex-none'>
        <DateRangePicker
          align='left'
          startDate={getQueryParams().startDate}
          endDate={getQueryParams().endDate}
          onTimeChange={handleTimeChange}
        />
      </div>

      <div className='px-0'>
        <IconMultipleSelect
          options={workflowTypeOptions}
          selectedItemValues={selectedWorkflowTypeIdsStr.split(',')}
          onApply={handleSelectWorkflowType}
          hasSelectAllOption={true}
          selectAllOptionValue='-1'
        />
      </div> */}

          <div className='flex-none px-0'>
            <Button
              size='md'
              onClick={() => {
                clearQueryParams();
              }}
              className='text-gray-400 hover:text-white'
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>
      {/* <div>
    <ButtonGroup
      buttonItems={workflowRunStatusOptions}
      selectedItemLabel={queryParams.get('workflowRunStatus') || 'all'}
    />
  </div> */}
    </>
  );
};

export default SequenceRunFilterHeader;
