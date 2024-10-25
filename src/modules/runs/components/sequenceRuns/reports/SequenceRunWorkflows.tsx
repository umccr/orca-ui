import { mockStatusData } from '@/api/_mock/mockWorkflowStatusData';
import { Select } from '@/components/common/select';
import { WorkflowDiagram } from '@/components/diagrams';
import WorkflowTable from '../components/WorkflowRunTable';

const SequenceRunWorkflows = () => {
  return (
    <div>
      {/* <div className='px-5 flex text-sm items-center align w-full max-w-lg md:max-w-xs'>
        <label className='px-2' htmlFor='select'>
          Data Journey
        </label>
        <Select
          // id='select'
          options={[
            { value: '201419990435s', label: '201419990435s' },
            { value: '201419990435s', label: '201419990435s' },
            { value: '201419990435s', label: '201419990435s' },
            { value: '201419990435s', label: '201419990435s' },
          ]}
          value={{ value: 'Data Journey', label: 'Data Journey' }}
          onChange={(selected: any) => {
            console.log(selected.value);
          }}
        />
      </div> */}

      <div className='w-[1000px] h-[400px]'>
        <WorkflowDiagram pipelineType='workflows' statusData={mockStatusData} />
      </div>
      <div className='flex flex-col'>{/* <WorkflowTable /> */}</div>
    </div>
  );
};

export default SequenceRunWorkflows;
