import { ApolloClient, ApolloProvider } from '@apollo/client';

import { InMemoryCache } from '@apollo/client';
import { LimsTable } from '../components/lims/LimsTable';
import SideBarLayout from '../layouts/SideBar';
import { FieldDefinition, GraphqlFilter } from '../components/graphqlFilter';
import { fetchAuthSession } from 'aws-amplify/auth';

const limsClient = new ApolloClient({
  uri: 'https://lims.vault.prod.umccr.org/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${(await fetchAuthSession()).tokens?.idToken?.toString()}`,
  },
});

const filterOptions: FieldDefinition[] = [
  { key: 'assay', label: 'Assay', type: 'string' },
  { key: 'external_sample_id', label: 'External Sample ID', type: 'string' },
  { key: 'external_subject_id', label: 'External Subject ID', type: 'string' },
  { key: 'experiment_id', label: 'Experiment ID', type: 'string' },
  { key: 'internal_subject_id', label: 'Internal Subject ID', type: 'string' },
  { key: 'library_id', label: 'Library ID', type: 'string' },
  { key: 'load_datetime', label: 'Load DateTime', type: 'timestamp' },
  { key: 'owner_id', label: 'Owner ID', type: 'string' },
  { key: 'phenotype', label: 'Phenotype', type: 'string' },
  { key: 'project_id', label: 'Project ID', type: 'string' },
  { key: 'quality', label: 'Quality', type: 'string' },
  { key: 'sample_id', label: 'Sample ID', type: 'string' },
  { key: 'sequencing_run_date', label: 'Sequencing Run Date', type: 'date' },
  { key: 'sequencing_run_id', label: 'Sequencing Run ID', type: 'string' },
  { key: 'source', label: 'Source', type: 'string' },
  { key: 'truseq_index', label: 'Truseq Index', type: 'string' },
  { key: 'type', label: 'Type', type: 'string' },
  { key: 'workflow', label: 'Workflow', type: 'string' },
];

export default function LimsPage() {
  return (
    <SideBarLayout sideBar={<GraphqlFilter fieldFilters={filterOptions} />}>
      <div className='flex flex-col'>
        <h1 className='font-bold'>LIMS</h1>

        <p className='my-2 text-xs text-gray-500 dark:text-gray-400'>
          The LIMS data is updated daily from multiple sources, so there may be up to a one-day
          delay in reflecting the latest changes.
        </p>

        <ApolloProvider client={limsClient}>
          <LimsTable fieldDefinitions={filterOptions} />
        </ApolloProvider>
      </div>
    </SideBarLayout>
  );
}
