import type { ReactElement } from 'react';

// 路由配置类型
export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => ReactElement>;
  children?: RouteConfig[];
  protected?: boolean;
}

// 导航项类型
export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// 路由元数据类型
export interface RouteMeta {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
}
