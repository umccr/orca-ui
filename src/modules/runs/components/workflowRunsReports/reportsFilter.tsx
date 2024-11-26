// filter by time frame and anaylsyis run or sequence run
import { DateRangePicker } from '@/components/common/datepicker';
import { useQueryParams } from '@/hooks/useQueryParams';

const ReportsFilterHeader = () => {
  const { setQueryParams, getQueryParams } = useQueryParams();

  const handleTimeChange = (startDate: string | null, endDate: string | null) => {
    setQueryParams({ startDate, endDate });
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
      <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0'>
        <div className='flex items-center'>
          <span className='text-sm font-medium text-gray-600 mr-3'>Time Period:</span>
          <DateRangePicker
            align='left'
            startDate={getQueryParams().startDate}
            endDate={getQueryParams().endDate}
            onTimeChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsFilterHeader;
