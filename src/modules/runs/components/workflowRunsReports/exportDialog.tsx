import { Button } from '@/components/common/buttons';

const ExportDialog = () => {
  return (
    <div className='space-x-2'>
      <Button onClick={exportAsPDF}>Export PDF</Button>
      <Button onClick={exportAsHTML}>Export HTML</Button>
    </div>
  );
};

export default ExportDialog;
