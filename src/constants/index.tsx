import { IssuePriority, IssueStatus, ProjectStatus } from '@/types/enum';
import {
  Flame,
  ArrowUp,
  Minus,
  CircleDashed,
  Circle,
  CircleCheck,
  CircleX,
} from 'lucide-react';

export const priorityOptions: {
  value: IssuePriority;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: IssuePriority.None,
    label: 'None',
    icon: <Minus className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: IssuePriority.Urgent,
    label: 'Urgent',
    icon: <Flame className="h-4 w-4 text-destructive" />,
  },
  {
    value: IssuePriority.High,
    label: 'High',
    icon: <ArrowUp className="h-4 w-4 text-orange-500" />,
  },
  {
    value: IssuePriority.Medium,
    label: 'Medium',
    icon: <Minus className="h-4 w-4 text-blue-500" />,
  },
  {
    value: IssuePriority.Low,
    label: 'Low',
    icon: <Minus className="h-4 w-4 text-muted-foreground" />,
  },
];

export const statusOptions: {
  value: IssueStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: IssueStatus.Backlog,
    label: 'Backlog',
    icon: <CircleDashed className="h-4 w-4 text-gray-500" />,
  },
  {
    value: IssueStatus.Todo,
    label: 'Todo',
    icon: <Circle className="h-4 w-4 text-gray-500" />,
  },
  {
    value: IssueStatus.InProgress,
    label: 'In Progress',
    icon: <Circle className="h-4 w-4 text-yellow-500" />,
  },
  {
    value: IssueStatus.InReview,
    label: 'In Review',
    icon: <Circle className="h-4 w-4 text-blue-500" />,
  },
  {
    value: IssueStatus.Done,
    label: 'Done',
    icon: <CircleCheck className="h-4 w-4 text-green-500" />,
  },
  {
    value: IssueStatus.Canceled,
    label: 'Canceled',
    icon: <CircleX className="h-4 w-4 text-gray-500" />,
  },
];

export const projectStatusOptions: {
  value: ProjectStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: ProjectStatus.Backlog,
    label: 'Backlog',
    icon: <CircleDashed className="h-4 w-4 text-gray-500" />,
  },
  {
    value: ProjectStatus.Planned,
    label: 'Todo',
    icon: <Circle className="h-4 w-4 text-gray-500" />,
  },
  {
    value: ProjectStatus.InProgress,
    label: 'In Progress',
    icon: <Circle className="h-4 w-4 text-yellow-500" />,
  },
  {
    value: ProjectStatus.Completed,
    label: 'Done',
    icon: <CircleCheck className="h-4 w-4 text-green-500" />,
  },
  {
    value: ProjectStatus.Cancelled,
    label: 'Canceled',
    icon: <CircleX className="h-4 w-4 text-gray-500" />,
  },
];

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return <Flame className="h-4 w-4 text-destructive" />;
    case 'High':
      return <ArrowUp className="h-4 w-4 text-orange-500" />;
    case 'Medium':
      return <Minus className="h-4 w-4 text-blue-500" />;
    case 'Low':
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};
