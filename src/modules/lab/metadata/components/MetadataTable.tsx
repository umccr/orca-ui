import { useMetadataFullLibraryModel, useMetadataFullSubjectModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { useQueryParams } from '@/hooks/useQueryParams';
import { MetadataFilterDropdown } from './MetadataFilterDropdown';

export const MetadataTable = () => {
  const { setQueryParams, getPaginationParams, getQueryParams, clearQueryParams } =
    useQueryParams();

  const queryParam = getQueryParams();
  const [searchBox, setSearchBox] = useState<string>(
    queryParam.subjectId ? queryParam.subjectId : queryParam.libraryId ? queryParam.libraryId : ''
  );

  // const fullSubjectModel = useMetadataFullSubjectModel({
  //   params: { query: { ...queryParam, ...getPaginationParams() } },
  // });
  // const data = fullSubjectModel.data;
  // if (!data) {
  //   throw new Error('No subject data found!');
  // }
  // const tableData = processSubjectFullResults(data.results);

  const fullLibraryModel = useMetadataFullLibraryModel({
    params: { query: { ...queryParam, ...getPaginationParams() } },
  });
  const data = fullLibraryModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }
  const tableData = processLibraryFullResults(data.results);

  return (
    <Table
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Metadata Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <div className='w-full max-w-lg md:max-w-xs relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input
                className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 sm:text-sm sm:leading-6'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchBox.startsWith('S')) {
                      setQueryParams({ subjectId: searchBox });
                    } else {
                      setQueryParams({ libraryId: searchBox });
                    }
                  }
                }}
                onChange={(e) => {
                  setSearchBox(e.target.value.trim());
                  if (!e.target.value) {
                    clearQueryParams();
                  }
                }}
                value={searchBox}
                id='search'
                name='search'
                placeholder='Search (SubjectId or LibraryId)'
                type='search'
              />
            </div>
            <MetadataFilterDropdown />
          </div>
        </div>
      }
      columns={[
        ...getSubjectColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParam['ordering'],
        }),
        ...specimenColumn,
        ...libraryColumn,
      ]}
      tableData={tableData}
      paginationProps={{
        totalCount: data.pagination.count ?? 0,
        rowsPerPage: data.pagination.rowsPerPage ?? 0,
        currentPage: data.pagination.page ?? 0,
        setPage: (n: number) => {
          setQueryParams({ page: n });
        },
        setRowsPerPage: (n: number) => {
          setQueryParams({ rowsPerPage: n });
        },
        countUnit: 'subjects',
      }}
    />
  );
};

/**
 * Process subject results record to table recognisable data
 * @param data the results returned from the API
 * @returns
 */
const processSubjectFullResults = (data: components['schemas']['SubjectFull'][]) => {
  return data.map((subject) => {
    const rec: Record<string, unknown[]> = {
      specimenId: [],
      source: [],
      libraryId: [],
      phenotype: [],
      workflow: [],
      quality: [],
      type: [],
      assay: [],
      coverage: [],
    };

    for (const specimen of subject.specimenSet) {
      for (const library of specimen.librarySet) {
        rec.specimenId.push(specimen.specimenId ?? '-');
        rec.source.push(specimen.source ?? '-');
        rec.libraryId.push(library.libraryId ?? '-');
        rec.phenotype.push(library.phenotype ?? '-');
        rec.workflow.push(library.workflow ?? '-');
        rec.quality.push(library.quality ?? '-');
        rec.type.push(library.type ?? '-');
        rec.assay.push(library.assay ?? '-');
        rec.coverage.push(library.coverage?.toString() ?? '-');
      }
    }

    return {
      subjectId: {
        orcabus_id: subject.orcabusId,
        subjectId: subject.subjectId,
      },
      ...rec,
    };
  });
};

/**
 * Process library results record to table recognisable data
 * @param data the results returned from the API
 * @returns
 */
const processLibraryFullResults = (data: components['schemas']['LibraryFull'][]) => {
  return data.map((library) => {
    const rec: Record<string, unknown[]> = {
      specimenId: [],
      source: [],
      libraryId: [],
      phenotype: [],
      workflow: [],
      quality: [],
      type: [],
      assay: [],
      coverage: [],
    };

    rec.libraryId.push(library.libraryId ?? '-');
    rec.phenotype.push(library.phenotype ?? '-');
    rec.workflow.push(library.workflow ?? '-');
    rec.quality.push(library.quality ?? '-');
    rec.type.push(library.type ?? '-');
    rec.assay.push(library.assay ?? '-');
    rec.coverage.push(library.coverage?.toString() ?? '-');

    rec.specimenId.push(library.specimen.specimenId ?? '-');
    rec.source.push(library.specimen.source ?? '-');

    return {
      subjectId: {
        orcabus_id: library.specimen.subject.orcabusId,
        subjectId: library.specimen.subject.subjectId,
      },
      ...rec,
    };
  });
};

/**
 * Table Columns Properties
 */

const getSubjectColumn = ({
  setSort,
  currentSort,
}: {
  setSort: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => {
  const currentSortDirection = !currentSort
    ? undefined
    : currentSort?.startsWith('-') && currentSort?.endsWith('subject_id')
      ? 'desc'
      : 'asc';

  return [
    {
      header: 'SubjectId',
      accessor: 'subjectId',
      onSort: () => {
        // Going the opposite here from the current sort direction
        setSort(`${currentSortDirection === 'desc' ? '' : '-'}subject_id`);
      },
      sortDirection: currentSortDirection,
      cell: (data: unknown) => {
        const { subjectId } = data as Record<string, string>;

        if (!subjectId) {
          return <div>-</div>;
        }

        return (
          <Link
            to={`subject/${subjectId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {subjectId}
          </Link>
        );
      },
    },
  ];
};

const multiRowCel = (p: unknown) => {
  const data = p as string[];
  return (
    <Fragment>
      {data.map((item, idx) => (
        <div className='py-2' key={idx}>
          {item}
        </div>
      ))}
    </Fragment>
  );
};

const specimenColumn: Column[] = [
  {
    header: 'SpecimenId',
    accessor: 'specimenId',
    cell: multiRowCel,
  },
  {
    header: 'Source',
    accessor: 'source',
    cell: multiRowCel,
  },
];

const libraryColumn = [
  {
    header: 'LibraryId',
    accessor: 'libraryId',
    cell: (p: unknown) => {
      const data = p as string[];
      return (
        <Fragment>
          {data.map((libId, idx) => {
            if (!libId) {
              return <div key={idx}>-</div>;
            }
            return (
              <div className='py-2' key={idx}>
                <Link
                  to={`library/${libId}`}
                  className={classNames(
                    'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                  )}
                >
                  {libId}
                </Link>
              </div>
            );
          })}
        </Fragment>
      );
    },
  },
  {
    header: 'Phenotype',
    accessor: 'phenotype',
    cell: multiRowCel,
  },
  {
    header: 'Workflow',
    accessor: 'workflow',
    cell: multiRowCel,
  },
  {
    header: 'Quality',
    accessor: 'quality',
    cell: multiRowCel,
  },
  {
    header: 'Type',
    accessor: 'type',
    cell: multiRowCel,
  },
  {
    header: 'Assay',
    accessor: 'assay',
    cell: multiRowCel,
  },
  {
    header: 'Coverage',
    accessor: 'coverage',
    cell: multiRowCel,
  },
];
