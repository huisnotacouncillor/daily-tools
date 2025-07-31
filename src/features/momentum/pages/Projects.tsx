import { ProjectHeader } from '../components/projects/ProjectHeader';
import { ProjectPanel } from '../components/projects/ProjectPanel';
import { PageLayout } from '@/components/layout/PageLayout';
import { SidebarProvider } from '@/providers';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectFilter } from '../components/projects/ProjectFilter';
import { useAuthContext } from '@/hooks';
import { projectAPI } from '@/services/api';
import { useEffect, useState } from 'react';
import type { Project } from '@/types';

export function Projects() {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const getProjects = async () => {
    if (!user || !user?.current_workspace_id) return;
    const { data: projects } = await projectAPI.getProjects(
      user?.current_workspace_id ?? ''
    );

    setProjects(projects?.projects ?? []);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const headerContent = (
    <>
      <ProjectHeader />
      <ProjectFilter />
    </>
  );
  const rightSidebarContent = <ProjectPanel />;
  const mainContent = <ProjectList projects={projects} />;

  return (
    <SidebarProvider>
      <PageLayout header={headerContent} sidebar={rightSidebarContent}>
        {mainContent}
      </PageLayout>
    </SidebarProvider>
  );
}
