import { t } from 'i18next';
import { ScrollArea } from '@ui/scroll-area';
import { PrioritySelector } from '@/components/common/priority-selector';
import { StatusSelector } from '@/components/common/status-selector';
import { IssuePriority, IssueStatus } from '@/types/enum';
import type { Project } from '@/types';
import { projectStatusOptions } from '@/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// 将字符串转换为 IssuePriority 枚举
const stringToPriority = (priorityStr: string): IssuePriority => {
  switch (priorityStr) {
    case 'Urgent':
      return IssuePriority.Urgent;
    case 'High':
      return IssuePriority.High;
    case 'Medium':
      return IssuePriority.Medium;
    case 'Low':
      return IssuePriority.Low;
    default:
      return IssuePriority.None;
  }
};

export function ProjectList({ projects }: { projects: Project[] }) {
  // 定义列宽度配置 - 重新排列，status 移到最后
  const columnWidths = {
    id: 'w-[80px]',
    name: 'flex-1',
    priority: 'w-[120px]',
    assignee: 'w-[120px]',
    created_at: 'w-[120px]',
    status: 'w-[100px]',
  };

  // 处理优先级变更
  const handlePriorityChange = (
    projectId: string,
    newPriority: IssuePriority
  ) => {
    console.log(projectId, newPriority);
  };

  // 处理状态变更
  const handleStatusChange = (projectId: string, newStatus: IssueStatus) => {
    console.log(projectId, newStatus);
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
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center h-12 px-3 hover:bg-muted/50 cursor-pointer"
              >
                <div className={`${columnWidths.name} px-3 font-medium`}>
                  {project.name}
                </div>
                <div className={`${columnWidths.priority} px-3`}>
                  <div className="flex items-center space-x-2">
                    <PrioritySelector
                      options={projectStatusOptions}
                      priority={stringToPriority(project.status)}
                      onChange={newPriority =>
                        handlePriorityChange(project.id, newPriority)
                      }
                    />
                  </div>
                </div>
                <div className={`${columnWidths.assignee} px-3`}>
                  {project.owner?.name}
                </div>
                <div
                  className={`${columnWidths.created_at} px-3 text-muted-foreground`}
                >
                  {project.created_at}
                </div>
                <div className={`${columnWidths.status} px-3`}>
                  <StatusSelector
                    options={projectStatusOptions}
                    status={project.status}
                    showLabel={true}
                    localePrefix="projects.status"
                    onChange={newStatus =>
                      handleStatusChange(project.id, newStatus)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
