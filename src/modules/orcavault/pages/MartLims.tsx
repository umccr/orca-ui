import { LimsTable } from '../components/lims/LimsTable';
import SideBarLayout from '../layouts/SideBar';
import { GraphqlFilter } from '../components/GraphqlFilter';
import { buildGraphQLFilter, FIELD_LABEL } from '../api/graphql/queries/allLims';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function LimsPage() {
  return (
    <SideBarLayout
      sideBar={<GraphqlFilter fieldFilters={FIELD_LABEL} buildGraphQLFilter={buildGraphQLFilter} />}
      iconOnClosed={<XMarkIcon className='h-5 w-5' />}
      iconOnOpen={<FunnelIcon className='h-5 w-5' />}
    >
      <div className='flex flex-col'>
        <h1 className='font-bold'>LIMS</h1>

        <p className='my-2 text-xs text-gray-500 dark:text-gray-400'>
          The LIMS data is updated daily from multiple sources, so there may be up to a one-day
          delay in reflecting the latest changes.
        </p>

        <LimsTable />
      </div>
    </SideBarLayout>
  );
}
