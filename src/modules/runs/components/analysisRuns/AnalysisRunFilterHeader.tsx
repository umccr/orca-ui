import { useQueryParams } from '@/hooks/useQueryParams';
import { Search } from '@/components/common/search';
import { Button } from '@/components/common/buttons';

const AnalysisRunFilterHeader = () => {
  const { setQueryParams, clearQueryParams, getQueryParams } = useQueryParams();
  return (
    <div className='w-full flex flex-row gap-1  md:flex-row items-center  justify-between p-2'>
      <div>
        <Search
          onSearch={(searchContent) => setQueryParams({ search: searchContent })}
          searchBoxContent={getQueryParams().search || ''}
          hasTooltip
        />
      </div>

      <div className='flex flex-row items-center gap-2'>
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
  );
};

export default AnalysisRunFilterHeader;
