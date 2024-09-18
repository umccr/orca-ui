import { WorkflowDiagram } from '@/components/diagrams';
import type { Meta, StoryObj } from '@storybook/react';
import { mockStatusData } from '@/api/_mock/mockWorkflowStatusData';

const meta: Meta = {
  title: 'Components/Diagrams',
  component: WorkflowDiagram,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkflowOverviewDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1200px] h-[800px]'>
        <WorkflowDiagram pipelineType='overview' statusData={mockStatusData} />
      </div>
    );
  },
};

// overview of workflows
export const workflowsDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1200px] h-[800px]'>
        <WorkflowDiagram pipelineType='workflows' statusData={mockStatusData} />
      </div>
    );
  },
};

export const WGSWorkflowDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1200px] h-[500px]'>
        <WorkflowDiagram pipelineType='wgs' statusData={mockStatusData} />
      </div>
    );
  },
};

export const WTSWorkflowDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1200px] h-[500px]'>
        <WorkflowDiagram pipelineType='wts' statusData={mockStatusData} />
      </div>
    );
  },
};

// ctTSO workflow
export const ctTSOWorkflowDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1000px] h-[500px]'>
        <WorkflowDiagram pipelineType='ctTSO' statusData={mockStatusData} />
      </div>
    );
  },
};

// ctDNA
export const ctDNAWorkflowDiagram: Story = {
  render: () => {
    return (
      <div className='w-[1000px] h-[500px]'>
        <WorkflowDiagram pipelineType='ctDNA' statusData={mockStatusData} />
      </div>
    );
  },
};
