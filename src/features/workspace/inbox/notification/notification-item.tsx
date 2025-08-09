import type { Notification } from '@/types';
import { NotificationType, NotificationStatus } from '@/types/enum';
import {
  Circle,
  CircleX,
  MessageSquare,
  Plus,
  RotateCcw,
  Play,
  Info,
} from 'lucide-react';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type NotificationItemProps = Notification;

const getStatusIcon = (
  status: NotificationStatus,
  type: NotificationType,
  isCompleted?: boolean
) => {
  if (isCompleted) {
    return <CircleX className="w-4 h-4 text-gray-400" />;
  }

  switch (status) {
    case NotificationStatus.Read:
      return <Circle className="w-4 h-4 text-gray-400 fill-gray-400" />;
    case NotificationStatus.Unread:
      switch (type) {
        case NotificationType.Comment:
          return <Info className="w-4 h-4 text-blue-500" />;
        case NotificationType.IssueAdded:
          return <RotateCcw className="w-4 h-4 text-orange-500" />;
        case NotificationType.StatusChange:
          return <Play className="w-4 h-4 text-orange-500" />;
        default:
          return <Circle className="w-4 h-4 text-gray-300" />;
      }
    default:
      return <Circle className="w-4 h-4 text-gray-300" />;
  }
};

const getUserIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.IssueAdded:
      return <Plus className="w-3 h-3 text-white" />;
    case NotificationType.Comment:
      return <MessageSquare className="w-3 h-3 text-white" />;
    case NotificationType.StatusChange:
      return <CircleX className="w-3 h-3 text-white" />;
    default:
      return null;
  }
};

export const NotificationItem = ({
  type,
  title,
  user,
  status,
  isCompleted,
  createdAt,
}: NotificationItemProps) => {
  const userIcon = getUserIcon(type);
  const statusIcon = getStatusIcon(status, type, isCompleted);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors',
        status === NotificationStatus.Unread && 'bg-accent/10'
      )}
    >
      {/* 用户头像 */}
      <div className="relative flex-shrink-0">
        {user.initials ? (
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
              user.color
            )}
          >
            {user.initials}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <Circle className="w-5 h-5 text-white" />
          </div>
        )}

        {/* 操作类型图标 */}
        {userIcon && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
            {userIcon}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {title}
            </h4>
          </div>

          {/* 右侧状态和时间 */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {statusIcon}
            <span className="text-xs text-muted-foreground">
              {dayjs(createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
