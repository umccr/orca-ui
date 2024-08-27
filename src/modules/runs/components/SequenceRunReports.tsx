import { PieChart, GanttChart } from '@/components/charts';

import { generateGanttData } from '@/api/_mock/mockTestData';
import WorkflowTable from './WorkflowRunTable';

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

const SequenceRunReports = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <div className='flex flex-col w-1/2'>
          <PieChart data={data} width={480} height={240} />
        </div>
        {/* <div className='flex flex-col w-1/2'>
          <PieChart data={data} width={480} height={240} />
        </div> */}
        <div className='flex flex-col w-1/2'>
          <GanttChart tasks={generateGanttData()} width={480} height={300} />
        </div>
      </div>

      {/* <div className='flex flex-col'>
        <WorkflowTable />
      </div> */}
      <WorkflowTable />
    </div>
  );
};

export default SequenceRunReports;
