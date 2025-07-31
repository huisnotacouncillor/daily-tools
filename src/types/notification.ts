import { NotificationType, NotificationStatus } from './enum';
// 通知相关类型
export interface NotificationUser {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  user: NotificationUser;
  project?: string;
  issue?: string;
  status: NotificationStatus;
  isCompleted?: boolean;
  createdAt: string;
  readAt?: string;
}
