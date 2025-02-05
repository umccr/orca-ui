/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { Badge } from '.';
import { StatusIcon } from '../statusIcon';
import { classNames } from '@/utils/commonUtils';
import { getBadgeStatusType, statusTextColor } from '@/utils/statusUtils';

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge status={status} className='flex h-7 flex-row items-center'>
      <div className='pr-2'>
        <StatusIcon
          status={status}
          className={classNames('animate-none', statusTextColor(getBadgeStatusType(status)))}
        ></StatusIcon>
      </div>
      <span>{status}</span>
    </Badge>
  );
};

export default StatusBadge;
