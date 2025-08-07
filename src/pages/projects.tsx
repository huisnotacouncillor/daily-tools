import { PageLayout } from '@/layouts/page-layout';
import {
  ProjectHeader,
  ProjectPanel,
  ProjectList,
  ProjectFilter,
} from '@features/projects';
import { useState } from 'react';
import type { Project } from '@/types';
import { ProjectStatus } from '@/types/enum';

// 模拟数据
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Momentum Launch',
    project_key: 'MOM',
    description: 'Momentum 产品正式发布项目',
    progress: 75,
    status: ProjectStatus.InProgress,
    workspace_id: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'UI 组件库',
    project_key: 'UI',
    description: '设计和开发统一的UI组件库',
    progress: 90,
    status: ProjectStatus.InProgress,
    workspace_id: '1',
    created_at: '2024-01-02',
    updated_at: '2024-01-14',
  },
];

export function Projects() {
  const [projects] = useState<Project[]>(initialProjects);

  const headerContent = (
    <>
      <ProjectHeader />
      <ProjectFilter />
    </>
  );

  const sidebarContent = <ProjectPanel />;

  const mainContent = <ProjectList projects={projects} />;

  return (
    <PageLayout
      header={headerContent}
      sidebar={sidebarContent}
      enableSidebarToggle={true}
    >
      {mainContent}
    </PageLayout>
  );
}
