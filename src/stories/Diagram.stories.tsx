import { WorkflowDiagram } from '@/components/diagrams';
import type { Meta, StoryObj } from '@storybook/react';

const mockStatusData = {
  Sequencer: {
    status: 'Requested',
    description: '',
  },
  BSSH: {
    status: 'Queued',
    description: 'BSSH failed to complete',
  },
  BCL_CONVERT: {
    status: 'Initializing',
    description: 'BCL_CONVERT failed to complete',
  },
  TSO_CTDNA_TUMOR_ONLY: {
    status: 'Preparing Inputs',
    description: 'DRAGEN_WGS_QC failed to complete',
  },
  WGS_ALIGNMENT_QC: {
    status: 'In Progress',
    description: 'TUMOR_NORMAL failed to complete',
  },
  WTS_ALIGNMENT_QC: {
    status: 'Generating Outputs',
    description: 'DRAGEN_TSO_CTDNA failed to complete',
  },
  WTS_TUMOR_ONLY: {
    status: 'Aborting',
    description: 'DRAGEN_WTS failed to complete',
  },
  UMCCRISE: {
    status: 'Aborted',
    description: 'UMCCRISE failed to complete',
  },
  ONCOANALYSER_WGS: {
    status: 'Failed',
    description: 'ONCOANALYSER_WGS failed to complete',
  },
  SASH: {
    status: 'Succeeded',
    description: 'SASH failed to complete',
  },
  ONCOANALYSER_WGTS_BOTH: {
    status: 'Failed',
    description: 'ONCOANALYSER_WGTS_BOTH failed to complete',
  },

  RNASUM: {
    status: 'Failed',
    description: 'RNASUM failed to complete',
  },
  STAR_ALIGNMENT: {
    status: 'Failed',
    description: 'STAR_ALIGNMENT failed to complete',
  },
  ONCOANALYSER_WTS: {
    status: 'Failed',
    description: 'ONCOANALYSER_WTS failed to complete',
  },
  HOLMES: {
    status: 'Failed',
    description: 'HOLMES failed to complete',
  },
  PIERIAN_DX: {
    status: 'Failed',
    description: 'PIERIAN_DX failed to complete',
  },
  WGS_TUMOR_NORMAL: {
    status: 'Failed',
    description: 'WGS_TUMOR_NORMAL failed to complete',
  },
  GPL: {
    status: 'Failed',
    description: 'GPL failed to complete',
  },
};

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
