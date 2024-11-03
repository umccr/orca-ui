// filter by time frame and anaylsyis run or sequence run
import { DateRangePicker } from '@/components/common/datepicker';
import { useQueryParams } from '@/hooks/useQueryParams';

const ReportsFilterHeader = () => {
  const { setQueryParams, getQueryParams } = useQueryParams();

  const handleTimeChange = (startDate: string | null, endDate: string | null) => {
    setQueryParams({ startDate, endDate });
  };

  return (
    <div className='flex flex-row items-center'>
      <div className='text-xl font-base mr-4'>Period</div>
      <DateRangePicker
        align='left'
        startDate={getQueryParams().startDate}
        endDate={getQueryParams().endDate}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
};

export default ReportsFilterHeader;
