import { ProjectListQueryParams, useQueryMetadataProjectModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Search } from '@/components/common/search';
import Table from '@/components/tables/Table';
import { getProjectTableColumn } from './utils';
import { ProjectTableFilter } from './ProjectTableFilter';
import { getContactTableColumn } from '../contact/utils';

export const ProjectListAPITable = ({ queryParams }: { queryParams: ProjectListQueryParams }) => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const projectModel = useQueryMetadataProjectModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = projectModel.data;

  const flatData = data ? processDataResults(data.results) : [];
  const pagination = data?.pagination;

  return (
    <Table
      inCard={false}
      isFetchingData={projectModel.isFetching}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Project Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <div className='w-1/5'>
              <Search
                onSearch={(s) => setQueryParams({ search: s })}
                searchBoxContent={getQueryParams().search}
              />
            </div>
            <div className='ml-2'>
              <ProjectTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        // Not showing library as 1 project contain hundreds of libraries
        // Will need to show in a paginated way
        ...getProjectTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
          headerClassName: 'bg-transparent',
          cellClassName: 'bg-transparent',
        }),
        ...getContactTableColumn({
          headerGroupLabel: 'Contact',
          // headerClassName: 'bg-orange-100',
          // cellClassName: 'bg-orange-50',
        }),
      ]}
      tableData={flatData}
      paginationProps={{
        totalCount: pagination?.count ?? 0,
        rowsPerPage: pagination?.rowsPerPage ?? 0,
        currentPage: pagination?.page ?? 0,
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
 * Process results record to a flat array of json. Unpack project and subject from nested
 * JSON object
 * @param data the results returned from the API
 * @returns
 */
const processDataResults = (data: components['schemas']['ProjectDetail'][]) => {
  return data.map((prj) => {
    const rec = {
      projectIds: {
        projectOrcabusId: prj.orcabusId,
        projectId: prj.projectId,
      },
      projectName: prj.name ?? '-',

      // Contact
      contactIds: [] as { contactId: string; contactOrcabusId: string }[],
      contactName: [] as string[],
    };

    for (const ctc of prj.contactSet) {
      rec.contactIds.push({
        contactId: ctc.contactId ?? '-',
        contactOrcabusId: ctc.orcabusId,
      });
      rec.contactName.push(ctc.name ?? '-');
    }

    return rec;
  });
};
