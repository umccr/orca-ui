import { PieChart, GanttChart, StackedBarChart } from '@/components/charts';

// import { generateMockGanttData } from '@/api/_mock/mockTestData';
import {
  generateMockWorkflowRunData,
  groupBySubjectAndCount,
} from '@/api/_mock/mockWorkflowRunData';
import { workflowTypeData } from '@/api/_mock/mockSeedData';

const SequenceRunOverview = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col'>
        <div className='flex flex-col w-1/2'>
          <PieChart data={workflowTypeData} width={500} height={240} />
        </div>
        <div className='flex flex-col w-1/2'>
          <StackedBarChart data={groupBySubjectAndCount()} width={500} />;
        </div>
      </div>

      {/* <div className='flex flex-col w-1/2'>
        <GanttChart tasks={generateMockWorkflowRunData()} width={880} height={300} />
      </div> */}
      <div className='flex flex-col '>
        <GanttChart tasks={generateMockWorkflowRunData()} width={1000} height={500} />
      </div>
    </div>
  );
};

export default SequenceRunOverview;
