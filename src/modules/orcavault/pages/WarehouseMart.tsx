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
import { Fragment, Suspense, useEffect } from 'react';
import { FASTQS_FIELD_LABEL } from '../api/graphql/queries/allFastqs';
import { WORKFLOWS_FIELD_LABEL } from '../api/graphql/queries/allWorkflows';

const selectedClassName =
  'inline-flex items-center gap-2 p-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 rounded-t-lg font-medium transition-colors duration-200';
const regularClassName =
  'inline-flex items-center gap-2 p-4 text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg cursor-pointer transition-all duration-200';

export default function WarehouseMartPage() {
  const { getQueryParams, setQueryParams } = useQueryParams();
  const currentParams = getQueryParams();

  const tableName = currentParams.tableName;
  const ordering = currentParams.ordering;
  const filter = currentParams.filter;

  useEffect(() => {
    if (!tableName || !isValidTableType(tableName)) {
      return;
    }

    if (!ordering && !filter) {
      const tableProps = getMartTableProperties(tableName);

      // Apply table-specific defaults on initial load: filter out null records and sort by most recent entries
      setQueryParams({ tableName, ...tableProps.defaultQueryParams }, true);
    }
  }, [tableName, ordering, filter, setQueryParams]);

  if (!tableName || !isValidTableType(tableName)) {
    return <Navigate replace to='?tableName=LIMS' />;
  }

  // Get the properties for the selected table
  const tableProps = getMartTableProperties(tableName);

  const Table = () => (
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
          dataKeyField={tableProps.dataKeyField}
          exportFilenamePrefix={tableProps.exportFilenamePrefix}
        />
      </div>
    </SideBarLayout>
  );

  const tabs = [
    { label: 'LIMS', content: <Table /> },
    { label: 'BAMS', content: <Table /> },
    { label: 'FASTQS', content: <Table /> },
    { label: 'WORKFLOWS', content: <Table /> },
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
    orderBy?: TOrderBy;
  }) => UseQueryResult<TData, Error>;
  dataKeyField: string;
  exportFilenamePrefix: string;
  defaultQueryParams?: Record<string, string>;
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
        dataKeyField: 'allBams',
        exportFilenamePrefix: 'bams-data',
        defaultQueryParams: {
          ordering: BamsOrderBy.LastModifiedDateDesc,
          filter: JSON.stringify({ and: [{ lastModifiedDate: { isNull: false } }] }),
        },
      };
    case 'LIMS':
      return {
        tableName: 'LIMS',
        fieldLabel: LIMS_FIELD_LABEL,
        dataHook: useAllLims,
        dataKeyField: 'allLims',
        exportFilenamePrefix: 'lims-data',
        defaultQueryParams: {
          ordering: LimsOrderBy.SequencingRunDateDesc,
          filter: JSON.stringify({ and: [{ sequencingRunDate: { isNull: false } }] }),
        },
      };

    case 'FASTQS':
      return {
        tableName: 'FASTQS',
        fieldLabel: FASTQS_FIELD_LABEL,
        dataHook: useAllFastqs,
        dataKeyField: 'allFastqs',
        exportFilenamePrefix: 'fastqs-data',
        defaultQueryParams: {
          ordering: FastqsOrderBy.SequencingRunDateDesc,
          filter: JSON.stringify({ and: [{ sequencingRunDate: { isNull: false } }] }),
        },
      };
    case 'WORKFLOWS':
      return {
        tableName: 'WORKFLOWS',
        fieldLabel: WORKFLOWS_FIELD_LABEL,
        dataHook: useAllWorkflows,
        dataKeyField: 'allWorkflows',
        exportFilenamePrefix: 'workflows-data',
        defaultQueryParams: {
          ordering: WorkflowsOrderBy.WorkflowEndDesc,
          filter: JSON.stringify({ and: [{ workflowEnd: { isNull: false } }] }),
        },
      };
  }
};
