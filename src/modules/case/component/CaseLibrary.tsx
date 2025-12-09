/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from '@/components/tables';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { useQueryMetadataLibraryModel } from '@/api/metadata';
import { getLibraryTableColumn } from '@/modules/lab/components/library/utils';
import { classNames } from '@/utils/commonUtils';

const CaseLibraryTable = ({ externalEntitySet }: { externalEntitySet: Record<string, any>[] }) => {
  // we want just the case for the library metadata for this component,
  // we will split this orcabusId map to its full case detail
  const libraryMapCase: Record<string, any> = {};
  externalEntitySet.forEach((o) => {
    if (o.externalEntity.serviceName == 'metadata' && o.externalEntity.type == 'library') {
      libraryMapCase[o.externalEntity.orcabusId] = { ...o };
    }
  });

  const libraryModel = useQueryMetadataLibraryModel({
    params: {
      query: {
        orcabusId: Object.keys(libraryMapCase),
        rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE,
      },
    },
  });

  const data = libraryModel.data;
  const flatData =
    data?.results.map((o) => {
      const rawOrcabusId = o.orcabusId.split('.')[1];
      return {
        libraryIds: {
          libraryOrcabusId: o.orcabusId,
          libraryId: o.libraryId,
        },
        libraryId: o.libraryId ?? '-',
        phenotype: o.phenotype ?? '-',
        workflow: o.workflow ?? '-',
        quality: o.quality ?? '-',
        type: o.type ?? '-',
        assay: o.assay ?? '-',
        coverage: o.coverage?.toString() ?? '-',
        overrideCycles: o.overrideCycles ?? '-',
        caseAddedVia: libraryMapCase[rawOrcabusId].addedVia,
        caseTimestamp: libraryMapCase[rawOrcabusId].timestamp,
      };
    }) ?? [];

  return (
    <Table
      isFetchingData={libraryModel.isFetching}
      inCard={false}
      columns={[
        ...getLibraryTableColumn({
          headerClassName: 'bg-transparent',
          cellClassName: 'bg-transparent',
        }),
        {
          header: 'Added via',
          headerClassName: classNames(
            'bg-red-50/90 dark:bg-red-900/40',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200'
          ),
          accessor: 'caseAddedVia',
        },
        {
          header: 'Linked on',
          headerClassName: classNames(
            'bg-red-50/90 dark:bg-red-900/40',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200'
          ),
          accessor: 'caseTimestamp',
        },
        {
          header: '',
          headerClassName: classNames(
            'bg-red-50/90 dark:bg-red-900/40',
            'text-gray-900 dark:text-gray-100',
            'transition-all duration-200'
          ),
          accessor: 'libraryIds',
          cell: () => {
            return (
              <div
                className='ml-2 cursor-pointer text-sm font-medium text-red-500 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                onClick={() => {
                  console.log('TODO: deleting relationship');
                }}
              >
                unlink
              </div>
            );
          },
        },
      ]}
      tableData={flatData}
    />
  );
};

export default CaseLibraryTable;
