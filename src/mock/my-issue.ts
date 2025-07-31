import type { Issue, AuthUser } from '@/types';
import { IssueStatus, IssuePriority } from '@/types/enum';

const mockUser: AuthUser = {
  id: 'huistnota',
  email: 'huistnota@example.com',
  username: 'huistnota',
  name: 'huisnota',
  avatar_url: '',
  current_workspace_id: 'workspace-1',
  workspaces: [
    {
      id: 'workspace-1',
      name: 'Personal Workspace',
      url_key: 'personal',
    },
    {
      id: 'workspace-2',
      name: 'Development Team - Frontend & Backend',
      url_key: 'dev-team',
    },
    {
      id: 'workspace-3',
      name: 'Design Studio for Creative Projects',
      url_key: 'design',
    },
    {
      id: 'workspace-4',
      name: 'Enterprise Solutions and Business Intelligence',
      url_key: 'enterprise',
    },
    {
      id: 'workspace-5',
      name: 'Research & Development Laboratory',
      url_key: 'r-and-d',
    },
  ],
  teams: [
    {
      id: 'team-1',
      name: 'Development Team',
      role: 'member',
      team_key: 'dev',
    },
    {
      id: 'team-2',
      name: 'Design Team',
      role: 'admin',
      team_key: 'design',
    },
  ],
};

// 模拟数据 - 添加了tags字段，移除了createdAt
export const initialIssues: Issue[] = [
  {
    id: 'PRO-123',
    title: '实现用户认证系统的完整功能，包括登录、注册、密码重置等核心功能模块',
    status: IssueStatus.Todo,
    priority: IssuePriority.Urgent,
    tags: ['backend', 'security', 'auth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: undefined,
  },
  {
    id: 'PRO-124',
    title: '修复登录页面样式问题',
    status: IssueStatus.InReview,
    priority: IssuePriority.High,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['frontend', 'ui', 'bug'],
    assignee: mockUser,
  },
  {
    id: 'PRO-125',
    title: '添加数据导出功能，支持多种格式导出',
    status: IssueStatus.Todo,
    priority: IssuePriority.Medium,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['feature', 'export'],
    assignee: undefined,
  },
  {
    id: 'PRO-126',
    title: '优化数据库查询性能',
    status: IssueStatus.Done,
    priority: IssuePriority.Low,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['performance', 'database'],
    assignee: mockUser,
  },
];
