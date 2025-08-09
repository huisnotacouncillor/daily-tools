import { NotificationList } from './notification-list';
import { NotificationHeader } from './notification-header';
import { ScrollArea } from '@ui/scroll-area';

export const Notification = () => {
  return (
    <div className="flex flex-col h-full">
      <NotificationHeader />
      <ScrollArea className="flex-auto overflow-hidden">
        <div className="flex flex-col p-1 space-y-1">
          <NotificationList />
        </div>
      </ScrollArea>
    </div>
  );
};
