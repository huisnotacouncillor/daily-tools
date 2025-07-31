import { notificationList } from '@/mock/notification';
import { NotificationItem } from './NotificationItem';

export const NotificationList = () => {
  return (
    <div className="flex flex-col gap-2">
      {notificationList.map(item => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  );
};
