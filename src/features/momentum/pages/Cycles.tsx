import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, ArrowUp, Minus, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 模拟数据
const mockCycles = [
  {
    id: 'cycle-15',
    name: 'Cycle 15',
    dateRange: '7月8日 - 7月21日',
    progress: 65,
  },
];

const mockIssues = {
  Backlog: [
    {
      id: 'PRO-127',
      title: '重构用户界面组件库',
      priority: 'High',
      assignee: '张三',
      project: 'Momentum',
    },
    {
      id: 'PRO-128',
      title: '实现实时通知系统',
      priority: 'Medium',
      assignee: '李四',
      project: 'Momentum',
    },
    {
      id: 'PRO-130',
      title: '添加国际化支持',
      priority: 'Medium',
      assignee: '赵六',
      project: 'Momentum',
    },
  ],
  Todo: [
    {
      id: 'PRO-129',
      title: '优化移动端性能',
      priority: 'Urgent',
      assignee: '王五',
      project: 'Momentum',
    },
    {
      id: 'PRO-131',
      title: '实现数据备份功能',
      priority: 'High',
      assignee: '张三',
      project: 'Momentum',
    },
  ],
  'In Progress': [
    {
      id: 'PRO-123',
      title: '实现用户认证系统',
      priority: 'Urgent',
      assignee: '张三',
      project: 'Momentum',
    },
    {
      id: 'PRO-124',
      title: '修复登录页面样式问题',
      priority: 'High',
      assignee: '李四',
      project: 'Momentum',
    },
    {
      id: 'PRO-132',
      title: '优化搜索功能',
      priority: 'Medium',
      assignee: '王五',
      project: 'Momentum',
    },
  ],
  'In Review': [
    {
      id: 'PRO-125',
      title: '添加数据导出功能',
      priority: 'Medium',
      assignee: '王五',
      project: 'Momentum',
    },
    {
      id: 'PRO-133',
      title: '修复用户权限问题',
      priority: 'High',
      assignee: '李四',
      project: 'Momentum',
    },
  ],
  Done: [
    {
      id: 'PRO-126',
      title: '优化数据库查询性能',
      priority: 'Low',
      assignee: '张三',
      project: 'Momentum',
    },
    {
      id: 'PRO-134',
      title: '完成基础功能开发',
      priority: 'Medium',
      assignee: '赵六',
      project: 'Momentum',
    },
  ],
  Testing: [
    {
      id: 'PRO-135',
      title: '单元测试覆盖',
      priority: 'Medium',
      assignee: '王五',
      project: 'Momentum',
    },
  ],
  Deployment: [
    {
      id: 'PRO-136',
      title: '生产环境部署',
      priority: 'High',
      assignee: '张三',
      project: 'Momentum',
    },
  ],
};

const columns = [
  'Backlog',
  'Todo',
  'In Progress',
  'In Review',
  'Done',
  'Testing',
  'Deployment',
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return <Flame className="h-3 w-3 text-destructive" />;
    case 'High':
      return <ArrowUp className="h-3 w-3 text-orange-500" />;
    case 'Medium':
      return <Minus className="h-3 w-3 text-blue-500" />;
    case 'Low':
      return <Minus className="h-3 w-3 text-muted-foreground" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

export function Cycles() {
  const { t } = useTranslation();
  const [currentCycle] = useState(mockCycles[0]);

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {/* Burndown Chart */}
            <Card className="w-64">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('cycles.burndown')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {currentCycle.progress}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('cycles.progress')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentCycle.name}</h1>
            <p className="text-muted-foreground">{currentCycle.dateRange}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Kanban Board */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="flex space-x-4 min-w-max">
          {columns.map(column => (
            <div key={column} className="w-80 flex-shrink-0">
              <div className="bg-card rounded-lg border h-96 flex flex-col">
                {/* Column Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {t(`cycles.column.${column}`)}
                    </h3>
                    <Badge variant="secondary">
                      {mockIssues[column as keyof typeof mockIssues]?.length ||
                        0}
                    </Badge>
                  </div>
                </div>

                {/* Column Content */}
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-2">
                    {mockIssues[column as keyof typeof mockIssues]?.map(
                      issue => (
                        <Card
                          key={issue.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {issue.title}
                              </h4>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-mono">{issue.id}</span>
                                <span>{issue.project}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  {getPriorityIcon(issue.priority)}
                                  <span className="text-xs">
                                    {t(`priority.${issue.priority}`)}
                                  </span>
                                </div>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={`/avatars/${issue.assignee}.png`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {issue.assignee.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
