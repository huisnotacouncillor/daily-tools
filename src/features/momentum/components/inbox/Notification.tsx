import { NotificationList } from './NotificationList';
import { NotificationHeader } from './NotificationHeader';
import { ScrollArea } from '@/components/ui/scroll-area';

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
