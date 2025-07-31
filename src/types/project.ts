import { IssuePriority, ProjectStatus } from './enum';

export interface Project {
  id: string;
  name: string;
  project_key: string;
  description?: string;
  target_date?: string;
  owner?: any;
  team?: any;
  progress: number;
  workspace_id: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectForm {
  name: string;
  description?: string;
  project_key: string;
  status?: ProjectStatus;
  priority?: IssuePriority;
  owner?: any;
  team?: any;
}
