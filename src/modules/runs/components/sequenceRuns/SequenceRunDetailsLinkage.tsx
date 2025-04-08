import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSequenceRunContext } from './SequenceRunContext';
import { Accordion } from '@/components/common/accordion';
import { Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { useSuspenseMetadataLibraryModel } from '@/api/metadata';
import { keepPreviousData } from '@tanstack/react-query';

const SequenceRunDetailsLinkage = () => {
  const { sequenceRunDetail, isFetchingSequenceRunDetail } = useSequenceRunContext();

  const {
    data: librariesData,
    isFetching: isFetchingLibrariesData,
    isError: isErrorLibrariesData,
    error: errorLibrariesData,
  } = useSuspenseMetadataLibraryModel({
    params: {
      query: {
        library_id: sequenceRunDetail?.libraries,
        rowsPerPage: sequenceRunDetail?.libraries.length || 0 + 10,
      },
    },
    reactQuery: {
      enabled: !!sequenceRunDetail?.libraries.length,
      placeholderData: keepPreviousData,
    },
  });

  if (isErrorLibrariesData) {
    throw errorLibrariesData;
  }

  const librariesTableData = useMemo(
    () =>
      sequenceRunDetail && sequenceRunDetail.libraries.length > 0
        ? sequenceRunDetail.libraries.map((library_id) => ({
            libraryId: library_id,
            orcabusId: librariesData?.results?.find((library) => library.libraryId === library_id)
              ?.orcabusId,
          }))
        : [],
    [sequenceRunDetail, librariesData]
  );

  const librariesTableColumns = useMemo(
    () => [
      {
        header: 'Library ID',
        accessor: 'libraryId',
      },
      {
        header: 'Orcabus ID',
        accessor: 'orcabusId',
        cell: (orcabusId: unknown) => {
          if (!orcabusId) {
            return <div>-</div>;
          } else {
            return (
              <Link
                to={`/lab/library/${orcabusId}/overview`}
                className={classNames('text-sm font-medium text-blue-500 hover:text-blue-700')}
              >
                <div>{orcabusId as string}</div>
              </Link>
            );
          }
        },
      },
    ],
    []
  );

  return (
    <div className=''>
      <Accordion
        title={
          <div className='flex items-center gap-2'>
            <span>Linked Libraries</span>
            <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
              {librariesTableData.length}
            </span>
          </div>
        }
        defaultOpen={false}
        className='rounded-lg border border-gray-200 shadow-xs'
        chevronPosition='right'
      >
        <Table
          // tableHeader='Libraries'
          inCard={true}
          columns={librariesTableColumns}
          tableData={librariesTableData}
          isFetchingData={isFetchingSequenceRunDetail || isFetchingLibrariesData}
        />
      </Accordion>
    </div>
  );
};

export default SequenceRunDetailsLinkage;
