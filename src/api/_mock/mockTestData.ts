export const generateGanttData = (): { startDate: Date; endDate: Date; taskName: string }[] => {
  const tasks = [];
  const taskNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let currentDate = new Date('Sun Dec 09 2012 00:00:00 EST');

  for (let i = 0; i < 26; i++) {
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
