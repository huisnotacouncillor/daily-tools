import { t } from 'i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { PrioritySelector } from '../PrioritySelector';
// import { StatusSelector } from '../StatusSelector';
// import { IssuePriority, IssueStatus } from '@/types/enum';
import type { Team } from '@/types';
// import { projectStatusOptions } from '../constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function TeamList({ teams }: { teams: Team[] }) {
  // 定义列宽度配置 - 重新排列，status 移到最后
  const columnWidths = {
    id: 'w-[80px]',
    name: 'flex-1',
    priority: 'w-[120px]',
    assignee: 'w-[120px]',
    created_at: 'w-[120px]',
    status: 'w-[100px]',
  };

  return (
    <div className="flex flex-col h-full">
      {/* 固定头部 */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="flex items-center h-12 px-3 text-sm font-medium text-muted-foreground">
          <div className={`${columnWidths.name} px-3`}>{t('title')}</div>
          <div className={`${columnWidths.priority} px-3`}>{t('priority')}</div>
          <div className={`${columnWidths.assignee} px-3`}>{t('assignee')}</div>
          <div className={`${columnWidths.created_at} px-3`}>
            {t('createdAt')}
          </div>
          <div className={`${columnWidths.status} px-3`}>{t('status')}</div>
        </div>
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-0">
            {teams.map(team => (
              <div
                key={team.id}
                className="flex items-center h-12 px-3 hover:bg-muted/50 cursor-pointer"
              >
                <div className={`${columnWidths.name} px-3 font-medium`}>
                  {team.name}
                </div>
                <div className={`${columnWidths.assignee} px-3`}>
                  {team.members?.map(member => member.name).join(', ')}
                </div>
                <div
                  className={`${columnWidths.created_at} px-3 text-muted-foreground`}
                >
                  {team.created_at}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
