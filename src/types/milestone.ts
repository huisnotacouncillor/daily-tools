import { MilestoneStatus } from './enum';

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  targetDate: string;
  status: MilestoneStatus;
}
