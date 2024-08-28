import type { Meta, StoryObj } from '@storybook/react';
import { PieChart, GanttChart } from '@/components/charts';

import { generateMockGanttData } from '@/api/_mock/mockTestData';

const data = [
  { name: 'bcl_convert', value: 1 },
  { name: 'tso_ctdna_tumor_only', value: 6 },
  { name: 'wgs_alignment_qc', value: 22 },
  { name: 'wts_alignment_qc', value: 16 },
  { name: 'wts_tumor_only', value: 4 },
  { name: 'wgs_tumor_normal', value: 4 },
  { name: 'umccrise', value: 4 },
  { name: 'rnasum', value: 4 },
  { name: 'star_alignment', value: 4 },
  { name: 'oncoanalyser_wts', value: 4 },
  { name: 'oncoanalyser_wgs', value: 4 },
  { name: 'oncoanalyser_wgts_existing_both', value: 4 },
  { name: 'sash', value: 4 },
];

const ganttData = generateMockGanttData(data);

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
    return <PieChart data={data} width={480} height={240} />;
  },
};

export const GanttChartStory: Story = {
  render: () => {
    return <GanttChart tasks={ganttData} width={480} height={300} />;
  },
};
