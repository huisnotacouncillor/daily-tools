import { IssuePriority } from './enum';

export type PriorityFilterItem = {
  label: string;
  value: IssuePriority;
  icon: React.ReactNode;
};
