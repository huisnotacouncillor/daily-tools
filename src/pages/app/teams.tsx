import { PageLayout } from '@/layouts/page-layout';
import { TeamHeader, TeamList, TeamFilter } from '@/features/workspace/teams';
import { useState } from 'react';
import type { Team } from '@/types';

// 模拟数据
const initialTeams: Team[] = [
  {
    id: '1',
    name: '开发团队',
    team_key: 'dev',
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: '设计团队',
    team_key: 'design',
    created_at: '2024-01-02',
  },
];

export function Teams() {
  const [teams] = useState<Team[]>(initialTeams);

  const headerContent = (
    <div className="sticky top-0 z-10 bg-white">
      <TeamHeader />
      <TeamFilter />
    </div>
  );

  const mainContent = <TeamList teams={teams} />;

  return <PageLayout header={headerContent}>{mainContent}</PageLayout>;
}
