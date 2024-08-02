import { useMetadataFullSubjectModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

export const SubjectTable = () => {
  const [page, setPage] = useState<number>(1);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});

  const fullSubjectModel = useMetadataFullSubjectModel({
    params: { query: { page: page, ...dataQueryParams } },
  });

  const data = fullSubjectModel.data;
  if (!data) {
    throw new Error('No Data');
  }

  const tableData = processResults(data.results);

  return (
    <Table
      tableHeader={
        <div className='flex'>
          <div className='flex items-center'>{'Metadata Table'}</div>
          <div className='flex flex-1 items-center justify-end py-2'>
            <div className='w-full max-w-lg lg:max-w-xs'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (searchBox.startsWith('S')) {
                        setDataQueryParams({ internal_id: searchBox });
                      } else {
                        setDataQueryParams({ library_internal_id: searchBox });
                      }
                    }
                  }}
                  onChange={(e) => {
                    setSearchBox(e.target.value);
                    if (!e.target.value) {
                      setDataQueryParams({});
                    }
                  }}
                  value={searchBox}
                  id='search'
                  name='search'
                  className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  placeholder='Search (SubjectId or LibraryId)'
                  type='search'
                />
              </div>
            </div>
          </div>
        </div>
      }
      columns={[...subjectColumn, ...specimenColumn, ...libraryColumn]}
      tableData={tableData}
      paginationProps={{
        totalCount: data.pagination.count ?? 0,
        rowsPerPage: data.pagination.rowsPerPage ?? 0,
        currentPage: data.pagination.page ?? 0,
        setPage: (n: number) => {
          setPage(n);
        },
        countUnit: 'subjects',
      }}
    />
  );
};

/**
 * Process results record to table recognisable data
 * @param data the results returned from the API
 * @returns
 */
const processResults = (data: components['schemas']['SubjectFull'][]) => {
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

    for (const specimen of subject.specimen_set) {
      for (const library of specimen.library_set) {
        rec.specimenId.push(specimen.internal_id ?? '-');
        rec.source.push(specimen.source ?? '-');
        rec.libraryId.push({
          orcabus_id: library.id,
          internal_id: library.internal_id,
        });
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
        orcabus_id: subject.id,
        internal_id: subject.internal_id,
      },
      ...rec,
    };
  });
};

/**
 * Table Columns Properties
 */

const subjectColumn: Column[] = [
  {
    header: 'SubjectId',
    accessor: 'subjectId',
    cell: (data: unknown) => {
      const { orcabus_id, internal_id } = data as Record<string, string>;

      if (!internal_id) {
        return <div>-</div>;
      }

      return (
        <Link
          to={`/subject/${orcabus_id}`}
          className={classNames(
            'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
          )}
        >
          {internal_id}
        </Link>
      );
    },
  },
];

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
      const data = p as Record<string, string>[];

      return (
        <Fragment>
          {data.map((item, idx) => {
            if (!item.internal_id) {
              return <div key={idx}>-</div>;
            }
            return (
              <div className='py-2' key={idx}>
                <Link
                  to={`/library/${item.orcabus_id}`}
                  className={classNames(
                    'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                  )}
                >
                  {item.internal_id}
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
