import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_PAGE_SIZE } from '@/utils/constant';
import { dayjs } from '@/utils/dayjs';
import { Badge } from '@/components/common/badges';
import { StatusIcon } from '@/components/common/statusIcon';

import { LibraryType, WorkflowRun, generateMockLibraryRunData } from '@/api/_mock/mockLibraryData';
import { ContentTabs } from '@/components/navigation/tabs';
// import TableSearchHeader from './tableSearchHeader';
import { Button } from '@/components/common/buttons';
import { Select } from '@/components/common/select';

const basiscLibarayRunColumn: Column[] = [
  {
    header: 'Library Id',
    accessor: 'library_id',
  },
  {
    header: 'Subject Id',
    accessor: 'libraryDetails',
    cell: (libraryDetails: unknown) => {
      return (libraryDetails as any).subject_id;
    },
  },
  {
    header: 'Sample Id',
    accessor: 'libraryDetails',
    cell: (libraryDetails: unknown) => {
      return (libraryDetails as any).sample_id;
    },
  },
  // {
  //   header: 'Phenotype',
  //   accessor: 'phenotype',
  // },
];

const WGSLbraryRunStatuscolumn = [
  {
    header: 'DRAGEN_WGS_QC',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).DRAGEN_WGS_QC);
      const workflowRunData = (workflowsDetails as any).DRAGEN_WGS_QC;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
  {
    header: 'TUMOR_NORMAL',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).TUMOR_NORMAL);
      const workflowRunData = (workflowsDetails as any).TUMOR_NORMAL;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
  {
    header: 'UMCCRISE',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).UMCCRISE);
      const workflowRunData = (workflowsDetails as any).UMCCRISE;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
  {
    header: 'ONCOANALYSER_WGS',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).ONCOANALYSER_WGS);
      const workflowRunData = (workflowsDetails as any).ONCOANALYSER_WGS;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
  {
    header: 'SASH',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).SASH);
      const workflowRunData = (workflowsDetails as any).SASH;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
  {
    header: 'ONCOANALYSER_WGTS_BOTH',
    accessor: 'workflowsDetails',
    cell: (workflowsDetails: unknown) => {
      console.log((workflowsDetails as any).ONCOANALYSER_WGTS_BOTH);
      const workflowRunData = (workflowsDetails as any).ONCOANALYSER_WGTS_BOTH;
      return (
        <Badge status={(workflowRunData.end_status as string) || 'unkown'}>
          {workflowRunData.end_status}
        </Badge>
      );
    },
  },
];

const WTSLbraryRunStatuscolumn = [
  {
    header: 'DRAGEN_WTS_QC',
    accessor: 'DRAGEN_WTS_QC',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'DRAGEN_WTS',
    accessor: 'DRAGEN_WTS',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'RNASUM',
    accessor: 'RNASUM',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'STAR_ALIGNMENT',
    accessor: 'STAR_ALIGNMENT',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'ONCOANALYSER_WTS',
    accessor: 'ONCOANALYSER_WTS',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'ONCOANALYSER_WGTS_BOTH',
    accessor: 'ONCOANALYSER_WGTS_BOTH',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
];

const ctTSOLbraryRunStatuscolumn = [
  {
    header: 'DRAGEN_TSO_CTDNA',
    accessor: 'DRAGEN_TSO_CTDNA',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'UMCCRISE',
    accessor: 'UMCCRISE',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
];

const ctDNALbraryRunStatuscolumn = [
  {
    header: 'DRAGEN_TSO_CTDNA',
    accessor: 'DRAGEN_TSO_CTDNA',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
  {
    header: 'UMCCRISE',
    accessor: 'UMCCRISE',
    cell: (workflowRunData: unknown) => {
      return <StatusIconBadge status={(workflowRunData as WorkflowRun).end_status || 'unkown'} />;
    },
  },
];

const LibraryRunTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const [searchBox, setSearchBox] = useState<string>('');
  const [dataQueryParams, setDataQueryParams] = useState<Record<string, string>>({});
  const [libraryType, setLibraryType] = useState<string>('WGS');

  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
    // console.log('onChangeParams', getQueryParams());
  };
  const { setQueryParams, getPaginationParams, clearQueryParams } = useQueryParams(onChangeParams);

  useEffect(() => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
  }, [getPaginationParams]);

  const mockWGSLibraryRunData = generateMockLibraryRunData(5, LibraryType.WGS);
  const mockWTSLibraryRunData = generateMockLibraryRunData(5, LibraryType.WTS);
  const mockctTSOLibraryRunData = generateMockLibraryRunData(5, LibraryType.ctTSO);
  const mockctDNALibraryRunData = generateMockLibraryRunData(5, LibraryType.ctDNA);

  // console.log('mockLibraryData', mockWGSLibraryRunData);
  // console.log('mockWGSWorkflowRunData', mockWTSLibraryRunData);
  // console.log('mockWTSWorkflowRunData', mockctTSOLibraryRunData);
  // console.log('mockLibraryRunData', mockctDNALibraryRunData);

  const data = {
    pagination: {
      count: 20,
      page: 1,
      rowsPerPage: 10,
    },
    results: mockWGSLibraryRunData,
  };
  console.log('data', data);

  const tableData = data.results;
  // const wtsTableData = mockWTSWorkflowRunData;
  // const wgsTableData = mockWGSWorkflowRunData;

  return (
    <>
      <div></div>
      <Table
        tableHeader={
          <div className='flex flex-col md:flex-row'>
            <div className='flex flex-1 items-center pt-2'>
              <div className='w-full max-w-lg md:max-w-xs'>
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
              <div className='px-5 flex items-center align w-full max-w-lg md:max-w-xs'>
                <label className='px-2' htmlFor='select'>
                  Workflow Type
                </label>
                <Select
                  // id='select'
                  options={[
                    { value: 'WGS', label: 'WGS' },
                    { value: 'WTS', label: 'WTS' },
                    { value: 'ctTSO', label: 'ctTSO' },
                    { value: 'ctDNA', label: 'ctDNA' },
                  ]}
                  value={{ value: libraryType, label: libraryType }}
                  onChange={(selected: any) => {
                    setLibraryType(selected.value);
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  clearQueryParams();
                  setSearchBox('');
                }}
                className='ml-2 text-sm text-gray-400 hover:text-gray-600'
              >
                Reset
              </Button>
            </div>
          </div>
        }
        columns={[...basiscLibarayRunColumn, ...WGSLbraryRunStatuscolumn]}
        tableData={tableData as any}
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
    </>
  );
};

export default LibraryRunTable;
