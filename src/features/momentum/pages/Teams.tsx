import { PageLayout } from '@/components/layout/PageLayout';
import { SidebarProvider } from '@/providers';
import { useAuthContext } from '@/hooks';
import { teamAPI } from '@/services/api';
import { useEffect, useState } from 'react';
import { TeamHeader } from '../components/teams/TeamHeader';
import { TeamFilter } from '../components/teams/TeamFilter';
import { TeamList } from '../components/teams/TeamList';
import type { Team } from '@/types';

export function Teams() {
  const { user } = useAuthContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const getTeams = async () => {
    const { data } = await teamAPI.getTeams(user?.current_workspace_id ?? '');
    console.log(data);
    setTeams(data ?? []);
  };

  useEffect(() => {
    getTeams();
  }, []);

  const headerContent = (
    <>
      <TeamHeader />
      <TeamFilter />
    </>
  );
  const mainContent = <TeamList teams={teams} />;

  return (
    <SidebarProvider>
      <PageLayout header={headerContent}>{mainContent}</PageLayout>
    </SidebarProvider>
  );
}
