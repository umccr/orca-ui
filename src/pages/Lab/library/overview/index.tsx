import { WorkflowDiagram } from '@/components/diagrams';
import { LibraryTableDetails } from './components/LibraryTableDetails';
import { mockStatusData } from '@/stories/Diagram.stories';

export default function LibraryOverviewPage() {
  return (
    <div className='flex flex-col'>
      <LibraryTableDetails />
      <div className='flex flex-col'>
        <h1>Workflow progress</h1>
        <div className='w-full h-[500px]'>
          <WorkflowDiagram pipelineType='wgs' statusData={mockStatusData} />
        </div>
      </div>
    </div>
  );
}
