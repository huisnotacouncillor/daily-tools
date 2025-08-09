import { lazy } from 'react';
import type { RouteConfig } from '@/types/routing';

// 懒加载组件
const Login = lazy(() =>
  import('@/pages/public/login').then(module => ({
    default: module.Login,
  }))
);

const TestAuth = lazy(() =>
  import('@/pages/public/test-auth').then(module => ({
    default: module.TestAuth,
  }))
);

const Inbox = lazy(() =>
  import('@/pages/app/inbox').then(module => ({
    default: module.Inbox,
  }))
);

const MyIssues = lazy(() =>
  import('@/pages/app/my-issues').then(module => ({
    default: module.MyIssues,
  }))
);

const Cycles = lazy(() =>
  import('@/pages/app/cycles').then(module => ({
    default: module.Cycles,
  }))
);

const Teams = lazy(() =>
  import('@/pages/app/teams').then(module => ({
    default: module.Teams,
  }))
);

const Projects = lazy(() =>
  import('@/pages/app/projects').then(module => ({
    default: module.Projects,
  }))
);

const Roadmaps = lazy(() =>
  import('@/pages/app/roadmaps').then(module => ({
    default: module.Roadmaps,
  }))
);

const IssueLabels = lazy(() =>
  import('@/pages/admin/issue-labels').then(module => ({
    default: module.Labels,
  }))
);

const ProjectLabels = lazy(() =>
  import('@/pages/admin/project-labels').then(module => ({
    default: module.Labels,
  }))
);

// 公共路由
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: Login,
  },
];

// 受保护路由
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/test-auth',
    element: TestAuth,
  },
  {
    path: '/inbox/*',
    element: Inbox,
  },
  {
    path: '/my-issues/*',
    element: MyIssues,
  },
  {
    path: '/cycles/*',
    element: Cycles,
  },
  {
    path: '/teams/*',
    element: Teams,
  },
  {
    path: '/projects/*',
    element: Projects,
  },
  {
    path: '/roadmaps/*',
    element: Roadmaps,
  },
  {
    path: '/settings/issue-labels',
    element: IssueLabels,
  },
  {
    path: '/settings/project-labels',
    element: ProjectLabels,
  },
  // 默认路由
  {
    path: '/',
    element: Inbox,
  },
];

// 获取所有路由路径
export const getRoutePaths = (): string[] => {
  const paths: string[] = [];

  const extractPaths = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      paths.push(route.path);
      if (route.children) {
        extractPaths(route.children);
      }
    });
  };

  extractPaths([...publicRoutes, ...protectedRoutes]);
  return paths;
};

// 获取受保护的路由
export const getProtectedRoutes = (): RouteConfig[] => {
  return protectedRoutes;
};

// 获取公开路由
export const getPublicRoutes = (): RouteConfig[] => {
  return publicRoutes;
};
