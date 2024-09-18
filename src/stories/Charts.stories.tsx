import type { Meta, StoryObj } from '@storybook/react';
import { PieChart, GanttChart, ScatterplotMatrix, StackedBarChart } from '@/components/charts';

import {
  generateMockWorkflowRunData,
  groupBySubjectAndCount,
} from '@/api/_mock/mockWorkflowRunData';
import { workflowTypeData } from '@/api/_mock/mockSeedData';
import { scatterPlotData } from '@/api/_mock/mockScatterPlotData';

const ganttData = generateMockWorkflowRunData();

const meta: Meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimplePieChart: Story = {
  render: () => {
    return <PieChart data={workflowTypeData} width={480} height={240} />;
  },
};

export const GanttChartStory: Story = {
  render: () => {
    return <GanttChart tasks={ganttData} width={1000} height={600} />;
  },
};

export const ScatterplotStory: Story = {
  render: () => {
    return <ScatterplotMatrix data={scatterPlotData} width={1000} height={1000} />;
  },
};

export const StackedBarChartStory: Story = {
  render: () => {
    return <StackedBarChart data={groupBySubjectAndCount()} width={500} />;
  },
};
