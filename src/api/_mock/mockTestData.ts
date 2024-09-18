export const generateGanttData = (
  count: number
): { startDate: Date; endDate: Date; taskName: string }[] => {
  const tasks = [];
  const taskNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let currentDate = new Date('Sun Dec 09 2012 00:00:00 EST');

  for (let i = 0; i < count; i++) {
    const taskDurationHours = Math.floor(Math.random() * 4) + 1; // Tasks last between 1 and 4 hours
    const overlap = Math.floor(Math.random() * 3); // Up to 2 hours overlap
    const taskName = `${taskNames.charAt(i % 26)} Job`; // Cycle through 'A Job' to 'Z Job'

    const startDate = new Date(currentDate.getTime() - overlap * 3600000);
    const endDate = new Date(startDate.getTime() + taskDurationHours * 3600000);

    tasks.push({ startDate, endDate, taskName });

    // Update currentDate to the end of the current task for the next task
    currentDate = new Date(endDate.getTime());
  }

  return tasks;
};

export const generateMockGanttData = (
  tasksData: { name: string; value: number }[]
): { [key: string]: { startDate: Date; endDate: Date; taskName: string }[] } => {
  const ganttData: { [key: string]: { startDate: Date; endDate: Date; taskName: string }[] } = {};

  tasksData.forEach((task) => {
    ganttData[task.name] = generateGanttData(task.value);
  });

  return ganttData;
};

// we need generate gannt data for the data, like bcl_convert need 1 gannt data, tso_ctdna_tumor_only need 6 gannt data
// const data = [
//   { name: 'bcl_convert', value: 1 },
//   { name: 'tso_ctdna_tumor_only', value: 6 },
//   { name: 'wgs_alignment_qc', value: 22 },
//   { name: 'wts_alignment_qc', value: 16 },
//   { name: 'wts_tumor_only', value: 4 },
//   { name: 'wgs_tumor_normal', value: 4 },
//   { name: 'umccrise', value: 4 },
//   { name: 'rnasum', value: 4 },
//   { name: 'star_alignment', value: 4 },
//   { name: 'oncoanalyser_wts', value: 4 },
//   { name: 'oncoanalyser_wgs', value: 4 },
//   { name: 'oncoanalyser_wgts_existing_both', value: 4 },
//   { name: 'sash', value: 4 },
// ];

// example opuput:
// {
//   bcl_convert: [
//     {  startDate: '2022-09-09T14:00:00.000Z', endDate: '2022-09-09T15:00:00.000Z', taskName: 'A Job' }
//   ],
//   tso_ctdna_tumor_only: [
//     { startDate: '2022-09-09T15:00:00.000Z', endDate: '2022-09-09T17:00:00.000Z', taskName: 'B Job' },
//     { startDate: '2022-09-09T14:00:00.000Z', endDate: '2022-09-09T15:00:00.000Z', taskName: 'A Job' },
//     { startDate: '2022-09-09T13:00:00.000Z', endDate: '2022-09-09T14:00:00.000Z', taskName: 'Z Job' },
//     { startDate: '2022-09-09T12:00:00.000Z', endDate: '2022-09-09T13:00:00.000Z', taskName: 'Y Job' },
//     { startDate: '2022-09-09T11:00:00.000Z', endDate: '2022-09-09T12:00:00.000Z', taskName: 'X Job' },
//     { startDate: '2022-09-09T10:00:00.000Z', endDate: '2022-09-09T11:00:00.000Z', taskName: 'W Job' }
//   ],
//   wgs_alignment_qc: [
//     { startDate: '2022-09-09T17:00:00.000Z', endDate: '2022-09-09T19:00:00.000Z', taskName: 'C Job' },
//     { startDate: '2022-09-09T16:00:00.000Z', endDate: '2022-09-09T17:00:00.000Z', taskName: 'B Job' },...
