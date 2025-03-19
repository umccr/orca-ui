import { SampleListQueryParams, useSuspenseMetadataSampleModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Search } from '@/components/common/search';
import { SampleTableFilter } from './SampleTableFilter';
import { getLibraryTableColumn } from '../library/utils';
import { getSampleTableColumn } from './utils';

export const SampleListAPITable = ({ queryParams }: { queryParams: SampleListQueryParams }) => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const sampleModel = useSuspenseMetadataSampleModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = sampleModel.data;
  if (!data) {
    throw new Error('No individual data found!');
  }

  const flatData = processDataResults(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Sample Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <div className='w-1/5'>
              <Search
                onSearch={(s) => setQueryParams({ search: s })}
                searchBoxContent={getQueryParams().search}
              />
            </div>
            <div className='ml-2'>
              <SampleTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getSampleTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
        }),
        ...getLibraryTableColumn({
          headerGroupLabel: 'Library',
          headerClassName: 'bg-orange-100',
          cellClassName: 'bg-orange-50',
        }),
      ]}
      tableData={flatData}
      paginationProps={{
        totalCount: pagination.count ?? 0,
        rowsPerPage: pagination.rowsPerPage ?? 0,
        currentPage: pagination.page ?? 0,
        setPage: (n: number) => {
          setQueryParams({ page: n });
        },
        setRowsPerPage: (n: number) => {
          setQueryParams({ rowsPerPage: n });
        },
      }}
    />
  );
};

/**
 * Process results record to a flat array of json. Unpack sample and subject from nested
 * JSON object
 * @param data the results returned from the API
 * @returns
 */
const processDataResults = (data: components['schemas']['SampleDetail'][]) => {
  return data.map((smp) => {
    const rec = {
      sampleIds: {
        sampleOrcabusId: smp.orcabusId,
        sampleId: smp.sampleId,
      },
      sampleExternalId: smp.externalSampleId ?? '-',
      sampleSource: smp.source ?? '-',

      // libraries
      libraryIds: [] as { libraryId: string; libraryOrcabusId: string }[],
      phenotype: [] as string[],
      workflow: [] as string[],
      quality: [] as string[],
      type: [] as string[],
      assay: [] as string[],
      coverage: [] as string[],
      overrideCycles: [] as string[],
    };

    for (const lib of smp.librarySet) {
      rec.libraryIds.push({
        libraryId: lib.libraryId ?? '-',
        libraryOrcabusId: lib.orcabusId,
      });
      rec.phenotype.push(lib.phenotype ?? '-');
      rec.workflow.push(lib.workflow ?? '-');
      rec.quality.push(lib.quality ?? '-');
      rec.type.push(lib.type ?? '-');
      rec.assay.push(lib.assay ?? '-');
      rec.coverage.push(lib.coverage?.toString() ?? '-');
      rec.overrideCycles.push(lib.overrideCycles ?? '-');
    }

    return rec;
  });
};
