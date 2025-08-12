import SideBarLayout from '../layouts/SideBar';
import { FieldDefinition, GraphqlFilter } from '../components/GraphqlFilter';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GenericDataTable } from '../components/GenericTable';
import { SpinnerWithText } from '@/components/common/spinner';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import {
  All_BamsQuery,
  All_FastqsQuery,
  All_LimsQuery,
  All_WorkflowsQuery,
  BamFilter,
  BamsOrderBy,
  FastqFilter,
  FastqsOrderBy,
  LimFilter,
  LimsOrderBy,
  WorkflowFilter,
  WorkflowsOrderBy,
} from '../api/graphql/codegen/graphql';
import { useQueryParams } from '@/hooks/useQueryParams';

import { LIMS_FIELD_LABEL } from '../api/graphql/queries/allLims';
import {
  buildGraphQLFilter,
  useAllBams,
  useAllFastqs,
  useAllLims,
  useAllWorkflows,
} from '../api/mart/queries';
import { UseQueryResult } from '@tanstack/react-query';
import { BAMS_FIELD_LABEL } from '../api/graphql/queries/allBams';
import { Navigate } from 'react-router-dom';
import LocationBreadcrumb from '@/components/navigation/breadcrumbs';
import { Fragment, Suspense } from 'react';
import { FASTQS_FIELD_LABEL } from '../api/graphql/queries/allFastqs';
import { WORKFLOWS_FIELD_LABEL } from '../api/graphql/queries/allWorkflows';

const selectedClassName =
  'inline-flex items-center gap-2 p-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 rounded-t-lg font-medium transition-colors duration-200';
const regularClassName =
  'inline-flex items-center gap-2 p-4 text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg cursor-pointer transition-all duration-200';

export default function WarehouseMartPage() {
  const { getQueryParams, setQueryParams } = useQueryParams();
  const tableName = getQueryParams().tableName;
  if (!tableName || !isValidTableType(tableName)) {
    return <Navigate replace to='?tableName=LIMS' />;
  }
  // const [tableNameTab, setTableNameTab] = useState(tableName);
  const tableProps = getMartTableProperties(tableName);

  const table = () => (
    <SideBarLayout
      sideBar={
        <GraphqlFilter
          fieldFilters={tableProps.fieldLabel}
          buildGraphQLFilter={buildGraphQLFilter}
        />
      }
      iconOnClosed={<XMarkIcon className='h-5 w-5' />}
      iconOnOpen={<FunnelIcon className='h-5 w-5' />}
    >
      <div className='flex flex-col'>
        <h1 className='font-bold'>{tableProps.tableName}</h1>

        <p className='my-2 text-xs text-gray-500 dark:text-gray-400'>
          Data is updated daily from multiple sources, so there may be up to a one-day delay in
          reflecting the latest changes.
        </p>

        <GenericDataTable
          // FIXME: Remove the disable warning by having a function returning specific generic table component
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useDataHook={tableProps.dataHook as any}
          fieldLabel={tableProps.fieldLabel}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orderByDefault={tableProps.orderByDefault as any}
          dataKeyField={tableProps.dataKeyField}
          exportFilenamePrefix={tableProps.exportFilenamePrefix}
        />
      </div>
    </SideBarLayout>
  );

  const tabs = [
    { label: 'LIMS', content: table() },
    { label: 'BAMS', content: table() },
    { label: 'FASTQS', content: table() },
    { label: 'WORKFLOWS', content: table() },
  ];

  return (
    <div className='h-full w-full rounded-none! p-4 sm:px-4 lg:px-8 lg:py-6'>
      <LocationBreadcrumb className='mb-0' />

      <div className='my-4 flex items-center justify-start rounded-md bg-yellow-100 p-3 text-yellow-700'>
        <ExclamationTriangleIcon className='mr-2 h-5 w-5 flex-shrink-0' aria-hidden='true' />
        <p className='text-xs'>
          <strong>Warning:</strong> This Vault page is still experimental and may have some issues.
          For more reliable data, please check the metadata table on the Lab page.
        </p>
      </div>
      <div className='rounded-lg bg-white dark:bg-gray-900'>
        <div className='border-b border-gray-200 text-sm font-medium dark:border-gray-700'>
          <ul className='-mb-px flex flex-wrap'>
            {tabs.map((tab, index) => {
              const isSelected = tableName === tab.label;
              return (
                <li key={index}>
                  <div
                    onClick={() => setQueryParams({ tableName: tab.label }, true)}
                    className={isSelected ? selectedClassName : regularClassName}
                  >
                    {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='mt-2 px-2'>
          {tabs.map((tab, index) => {
            if (tableName === tab.label) {
              return (
                <Fragment key={index}>
                  <Suspense fallback={<SpinnerWithText />}>{tab.content}</Suspense>
                </Fragment>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

interface MartTableProperties<TData, TFilter, TOrderBy> {
  tableName: string;
  fieldLabel: FieldDefinition[];
  dataHook: (params: {
    filter: TFilter;
    first: number;
    offset: number;
    orderBy: TOrderBy;
  }) => UseQueryResult<TData, Error>;
  orderByDefault: TOrderBy;
  dataKeyField: string;
  exportFilenamePrefix: string;
  description?: string;
}
type TableType = 'LIMS' | 'BAMS' | 'FASTQS' | 'WORKFLOWS';
// Type guard function to check if a string is a valid TableType
const isValidTableType = (value: string): value is TableType => {
  return ['LIMS', 'BAMS', 'FASTQS', 'WORKFLOWS'].includes(value);
};

// Union type for all possible table configurations
type MartTablePropertiesUnion =
  | MartTableProperties<All_LimsQuery, LimFilter, LimsOrderBy>
  | MartTableProperties<All_BamsQuery, BamFilter, BamsOrderBy>
  | MartTableProperties<All_FastqsQuery, FastqFilter, FastqsOrderBy>
  | MartTableProperties<All_WorkflowsQuery, WorkflowFilter, WorkflowsOrderBy>;

const getMartTableProperties = (tableName: TableType): MartTablePropertiesUnion => {
  switch (tableName) {
    case 'BAMS':
      return {
        tableName: 'BAMS',
        fieldLabel: BAMS_FIELD_LABEL,
        dataHook: useAllBams,
        orderByDefault: BamsOrderBy.LastModifiedDateDesc,
        dataKeyField: 'allBams',
        exportFilenamePrefix: 'bams-data',
      };
    case 'LIMS':
      return {
        tableName: 'LIMS',
        fieldLabel: LIMS_FIELD_LABEL,
        dataHook: useAllLims,
        orderByDefault: LimsOrderBy.SequencingRunDateDesc,
        dataKeyField: 'allLims',
        exportFilenamePrefix: 'lims-data',
      };

    case 'FASTQS':
      return {
        tableName: 'FASTQS',
        fieldLabel: FASTQS_FIELD_LABEL,
        dataHook: useAllFastqs,
        orderByDefault: FastqsOrderBy.LastModifiedDateDesc,
        dataKeyField: 'allFastqs',
        exportFilenamePrefix: 'fastqs-data',
      };
    case 'WORKFLOWS':
      return {
        tableName: 'WORKFLOWS',
        fieldLabel: WORKFLOWS_FIELD_LABEL,
        dataHook: useAllWorkflows,
        orderByDefault: WorkflowsOrderBy.WorkflowEndDesc,
        dataKeyField: 'allWorkflows',
        exportFilenamePrefix: 'workflows-data',
      };
  }
};
