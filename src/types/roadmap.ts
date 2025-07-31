import type { Project } from './project';
import type { Milestone } from './milestone';

export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  milestones: Milestone[];
  projects: Project[];
}
