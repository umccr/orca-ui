import { IndividualListQueryParams, useSuspenseMetadataIndividualModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Search } from '@/components/common/search';
import { IndividualTableFilter } from './IndividualTableFilter';
import { getIndividualTableColumn } from './utils';
import { getSubjectTableColumn } from '../subject/utils';

export const IndividualListAPITable = ({
  queryParams,
}: {
  queryParams: IndividualListQueryParams;
}) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const individualModel = useSuspenseMetadataIndividualModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = individualModel.data;
  if (!data) {
    throw new Error('No individual data found!');
  }

  const flatData = processResult(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Individual Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search onSearch={(s) => setQueryParams({ search: s })} />
            <div className='ml-2'>
              <IndividualTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getIndividualTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
        }),
        ...getSubjectTableColumn({
          headerGroupLabel: 'Subject',
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
const processResult = (data: components['schemas']['IndividualDetail'][]) => {
  return data.map((idv) => {
    const rec: Record<string, unknown> = {
      // Library Model
      individualIds: {
        individualOrcabusId: idv.orcabusId,
        individualId: idv.individualId,
      },
      individualSource: idv.source ?? '-',

      // subject
      subjectIds: idv.subjectSet.map((subject) => ({
        subjectId: subject.subjectId,
        subjectOrcabusId: subject.orcabusId,
      })),
    };
    return rec;
  });
};
