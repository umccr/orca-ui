import { XMarkIcon } from '@heroicons/react/24/outline';
import { ReactNode, useState, FC, useEffect } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  type: NotificationType;
  title: string;
  message: ReactNode;
}

interface NotificationWithId extends NotificationItem {
  id: string;
}

interface NotificationItemProps extends NotificationWithId {
  onClose: (id: string) => void;
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
}

const getNotificationStyles = (type: NotificationType) => {
  const baseStyles = 'rounded-md p-4 mb-2 flex items-start justify-between';
  switch (type) {
    case 'info':
      return `${baseStyles} bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:text-blue-300`;
    case 'success':
      return `${baseStyles} bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-300`;
    case 'warning':
      return `${baseStyles} bg-yellow-50 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-300`;
    case 'error':
      return `${baseStyles} bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-300`;
    default:
      return baseStyles;
  }
};

const getIconStyles = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return 'text-blue-600 dark:text-blue-400';
    case 'success':
      return 'text-green-600 dark:text-green-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    default:
      return '';
  }
};

const NotificationItemComponent: FC<NotificationItemProps> = ({
  id,
  type,
  title,
  message,
  onClose,
}) => {
  return (
    <div className={getNotificationStyles(type)}>
      <div className='mr-3 flex-1'>
        <h3 className='text-sm font-medium'>{title}</h3>
        <div className='mt-1 text-sm opacity-90'>{message}</div>
      </div>
      <button
        type='button'
        className={`${getIconStyles(type)} transition-opacity duration-150 hover:opacity-75`}
        onClick={() => onClose(id)}
      >
        <XMarkIcon className='h-5 w-5' />
      </button>
    </div>
  );
};

export const NotificationContainer: FC<NotificationContainerProps> = ({ notifications }) => {
  const [notificationItems, setNotificationItems] = useState<NotificationWithId[]>([]);

  useEffect(() => {
    let counter = 0;
    if (notifications.length > 0) {
      const newNotifications = notifications.map((notification) => {
        counter++;
        return {
          ...notification,
          id: `notification-${counter}`,
        };
      });
      setNotificationItems(newNotifications);
    }
  }, [notifications]);

  const handleClose = (id: string) => {
    setNotificationItems((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div className='w-full space-y-2'>
      {notificationItems.map((notification) => (
        <NotificationItemComponent key={notification.id} {...notification} onClose={handleClose} />
      ))}
    </div>
  );
};

export default NotificationContainer;
