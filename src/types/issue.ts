import type { Project } from './project';
import type { AuthUser } from './auth';
import { IssueStatus, IssuePriority } from './enum';

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  project?: Project;
  assignee?: AuthUser;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
