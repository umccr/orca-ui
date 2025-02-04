import { Search } from '@/components/common/search';
import { Button, ButtonGroup } from '@/components/common/buttons';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DateRangePicker } from '@/components/common/datepicker';
import { useSequenceRunStatusCountModel } from '@/api/sequenceRun';
import { keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';

const SequenceRunFilterHeader = () => {
  const { setQueryParams, clearQueryParams, getQueryParams } = useQueryParams();
  const handleTimeChange = (startDate: string | null, endDate: string | null) => {
    setQueryParams({ startDate, endDate });
  };

  // get sequence run status count
  const { data: sequenceRunStatusCountData } = useSequenceRunStatusCountModel({
    params: {
      query: {
        search: getQueryParams().search || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
    reactQuery: {
      enabled: true,
      placeholderData: keepPreviousData,
    },
  });

  const sequenceRunStatusOptions = useMemo(() => {
    return sequenceRunStatusCountData
      ? [
          ...Object.keys(sequenceRunStatusCountData).map((status) => ({
            label: status.charAt(0).toUpperCase() + status.slice(1),
            subLabel:
              sequenceRunStatusCountData[
                status as keyof typeof sequenceRunStatusCountData
              ].toString(),
            onClick: () => {
              if (status === 'all') {
                setQueryParams({ sequenceRunStatus: null });
              } else {
                setQueryParams({ sequenceRunStatus: status });
              }
            },
          })),
        ]
      : [
          {
            label: 'All',
            subLabel: '',
            onClick: () => setQueryParams({ sequenceRunStatus: null }),
          },
          {
            label: 'Started',
            subLabel: '',
            onClick: () => setQueryParams({ sequenceRunStatus: 'started' }),
          },
          {
            label: 'Succeeded',
            subLabel: '',
            onClick: () => setQueryParams({ sequenceRunStatus: 'succeeded' }),
          },
          {
            label: 'Failed',
            subLabel: '',
            onClick: () => setQueryParams({ sequenceRunStatus: 'failed' }),
          },
          {
            label: 'Aborted',
            subLabel: '',
            onClick: () => setQueryParams({ sequenceRunStatus: 'aborted' }),
          },
        ];
  }, [setQueryParams, sequenceRunStatusCountData]);
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
          <DateRangePicker
            align='left'
            startDate={getQueryParams().startDate}
            endDate={getQueryParams().endDate}
            onTimeChange={handleTimeChange}
          />
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
      <div>
        <ButtonGroup
          buttonItems={sequenceRunStatusOptions}
          selectedItemLabel={getQueryParams().sequenceRunStatus || 'all'}
        />
      </div>
    </>
  );
};

export default SequenceRunFilterHeader;
