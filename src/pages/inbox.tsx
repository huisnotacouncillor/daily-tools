import { useTranslation } from 'react-i18next';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { Separator } from '@ui/separator';
import {
  MoreHorizontal,
  CalendarDays,
  User,
  MessageSquare,
  Clock,
  Plus,
} from 'lucide-react';
import { PageLayout } from '@/layouts/page-layout';
import { Notification } from '@/features/inbox/notification/notification';
import { ScrollArea } from '@ui/scroll-area';

// 模拟数据
const mockIssues = [
  {
    id: 'PRO-123',
    title: '实现用户认证系统',
    status: 'New',
    priority: 'High',
    project: 'Momentum',
    assignee: '张三',
    createdAt: '2024-01-15',
    description:
      '需要实现完整的用户认证系统，包括登录、注册、密码重置等功能。要求支持邮箱验证和多种认证方式。',
    comments: 3,
    tags: ['backend', 'security'],
  },
  {
    id: 'PRO-124',
    title: '修复登录页面样式问题',
    status: 'In Progress',
    priority: 'Medium',
    project: 'Momentum',
    assignee: '李四',
    createdAt: '2024-01-14',
    description: '登录页面在移动端显示异常，需要修复响应式布局问题。',
    comments: 1,
    tags: ['frontend', 'ui'],
  },
  {
    id: 'PRO-125',
    title: '添加数据导出功能',
    status: 'New',
    priority: 'Low',
    project: 'Momentum',
    assignee: '王五',
    createdAt: '2024-01-13',
    description:
      '为用户提供数据导出功能，支持CSV和Excel格式。需要考虑大数据量的性能问题。',
    comments: 0,
    tags: ['feature', 'export'],
  },
];

const statusColors = {
  New: 'bg-primary/10 text-primary',
  'In Progress':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'In Review':
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  Done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
};

const priorityColors = {
  High: 'bg-destructive/10 text-destructive',
  Medium:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  Low: 'bg-muted text-muted-foreground',
};

export function Inbox() {
  const { t } = useTranslation();
  const selectedIssue = mockIssues[0];

  // Main content - 消息详情
  const mainContent = (
    <ScrollArea className="h-full">
      <div className="p-6 h-full">
        {selectedIssue ? (
          <div className="h-full flex flex-col">
            {/* 消息头部 */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge
                    className={
                      statusColors[
                        selectedIssue.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {t(`status.${selectedIssue.status}`)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      priorityColors[
                        selectedIssue.priority as keyof typeof priorityColors
                      ]
                    }
                  >
                    {t(`priority.${selectedIssue.priority}`)}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-mono">
                    {selectedIssue.id}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <h1 className="text-2xl font-bold mb-3">{selectedIssue.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>
                    {t('assignee')}: {selectedIssue.assignee}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {t('createdAt')}: {selectedIssue.createdAt}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{selectedIssue.comments} comments</span>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* 消息内容 */}
            <div className="flex-1">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedIssue.description}
                </p>

                {selectedIssue.tags && selectedIssue.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('inbox.selectMessage')}</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  // Right sidebar content - 操作面板
  const rightSidebarContent = (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Clock className="h-4 w-4 mr-2" />
              Set reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Assign to me
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add comment
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Project</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedIssue?.project}
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View project
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Activity</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Created 2 days ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span>Updated 1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between border-b px-3 py-2">
      <div className="flex items-center">header</div>
      <div className="flex items-center">
        <Button variant="ghost" size="2xs">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout
      header={header}
      leftSidebar={<Notification />}
      sidebar={rightSidebarContent}
      enableLeftSidebarToggle={true}
      enableSidebarToggle={true}
      defaultLeftSidebarSize={30}
      defaultSidebarSize={25}
      minLeftSidebarSize={25}
      maxLeftSidebarSize={40}
      minSidebarSize={20}
      maxSidebarSize={35}
    >
      {mainContent}
    </PageLayout>
  );
}
