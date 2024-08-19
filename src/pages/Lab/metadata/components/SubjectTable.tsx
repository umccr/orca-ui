import { useMetadataFullSubjectModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';

export const SubjectTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});

  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
    // console.log('onChangeParams', getQueryParams());
  };
  const { setQueryParams, getPaginationParams } = useQueryParams(onChangeParams);

  useEffect(() => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
  }, [getPaginationParams]);

  const fullSubjectModel = useMetadataFullSubjectModel({
    params: { query: { ...dataQueryParams, page: page, rowsPerPage: rowsPerPage } },
  });

  const data = fullSubjectModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }

  const tableData = processResults(data.results);

  return (
    <Table
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Metadata Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <div className='w-full max-w-lg md:max-w-xs'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </div>
                <input
                  onBlur={() => {
                    setDataQueryParams({ key: searchBox });
                  }}
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
                    setSearchBox(e.target.value.trim());
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
        rec.libraryId.push(library.internal_id ?? '-');
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
      const { internal_id } = data as Record<string, string>;

      if (!internal_id) {
        return <div>-</div>;
      }

      return (
        <Link
          to={`subject/${internal_id}`}
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
