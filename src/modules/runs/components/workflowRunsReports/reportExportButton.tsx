import { FC } from 'react';
import { Button } from '@/components/common/buttons';

interface ReportExportButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const ReportExportButton: FC<ReportExportButtonProps> = ({ onClick, label, icon }) => {
  return (
    <Button onClick={onClick} type='light'>
      <div className='flex items-center'>
        {icon}
        <div className='ml-2'>{label}</div>
      </div>
    </Button>
  );
};

export default ReportExportButton;
