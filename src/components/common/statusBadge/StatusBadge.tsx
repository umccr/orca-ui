import { Badge } from '../badges';
import { StatusIcon } from '../statusIcon';

export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge status={status} className='flex flex-row items-center h-7'>
      <div className='pr-2 '>
        <StatusIcon status={status} className='animate-none !text-white '></StatusIcon>
      </div>

      <span>{status}</span>
    </Badge>
  );
};
