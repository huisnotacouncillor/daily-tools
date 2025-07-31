// issue 状态
export enum IssueStatus {
  Backlog,
  Todo,
  InProgress,
  InReview,
  Done,
  Canceled,
}
// issue 优先级
export enum IssuePriority {
  None,
  Low,
  Medium,
  High,
  Urgent,
}

// project 状态
export enum ProjectStatus {
  Backlog = 'Backlog',
  Planned = 'Planned',
  Completed = 'Completed',
  InProgress = 'InProgress',
  Cancelled = 'Cancelled',
}

// cycle 状态
export enum CycleStatus {
  Planning = 'Planning',
  Active = 'Active',
  Completed = 'Completed',
}

// milestone 状态
export enum MilestoneStatus {
  Planned = 'Planned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Delayed = 'Delayed',
}

// 通知类型
export enum NotificationType {
  Comment = 'comment',
  IssueAdded = 'issue_added',
  ProjectUpdate = 'project_update',
  Reminder = 'reminder',
  StatusChange = 'status_change',
}

// 通知状态
export enum NotificationStatus {
  Unread = 'unread',
  Read = 'read',
  Archived = 'archived',
}
