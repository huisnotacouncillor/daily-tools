import { CycleStatus } from './enum';
import type { Issue } from './issue';

export type Cycle = {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  issues: Issue[];
};
