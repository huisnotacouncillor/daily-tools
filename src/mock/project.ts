// 模拟数据
export const mockProject = {
  id: 'MOM-001',
  name: 'MOM-Momentum Launch',
  owner: '张三',
  targetDate: '2024-12-31',
  progress: 75,
  description: 'Momentum 产品正式发布项目',
};

export const mockProjectIssues = [
  {
    id: 'PRO-123',
    title: '实现用户认证系统',
    status: 'In Progress',
    priority: 'Urgent',
    assignee: '张三',
    createdAt: '2024-01-15',
  },
  {
    id: 'PRO-124',
    title: '修复登录页面样式问题',
    status: 'In Review',
    priority: 'High',
    assignee: '李四',
    createdAt: '2024-01-14',
  },
  {
    id: 'PRO-125',
    title: '添加数据导出功能',
    status: 'New',
    priority: 'Medium',
    assignee: '王五',
    createdAt: '2024-01-13',
  },
];

export const mockUpdates = [
  {
    id: 'update-1',
    title: '用户认证模块完成',
    content: '已完成用户登录、注册和权限管理功能，正在进行测试。',
    author: '张三',
    date: '2024-01-15',
  },
  {
    id: 'update-2',
    title: 'UI 组件库更新',
    content: '更新了按钮、表单等基础组件，提升了整体用户体验。',
    author: '李四',
    date: '2024-01-14',
  },
];
