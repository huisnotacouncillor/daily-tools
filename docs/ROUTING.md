# 路由配置管理

本项目采用了集中化的路由配置管理，使得路由的维护和扩展更加便捷。

## 文件结构

```
src/
├── config/
│   ├── routes.ts          # 路由配置文件
│   └── index.ts           # 配置统一导出
├── components/
│   └── routing/
│       └── RouteRenderer.tsx  # 路由渲染组件
├── types/
│   └── routing.ts         # 路由类型定义
└── App.tsx               # 主应用组件
```

## 路由配置

### 路由类型定义

```typescript
interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => ReactElement>;
  children?: RouteConfig[];
  protected?: boolean;
}
```

### 配置结构

路由配置分为两个部分：

1. **公开路由** (`publicRoutes`): 不需要身份验证的路由
2. **受保护路由** (`protectedRoutes`): 需要身份验证的路由

```typescript
// 公开路由配置
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: Login,
    protected: false,
  },
];

// 受保护的路由配置
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/',
    element: Inbox,
    protected: true,
    children: [
      {
        path: '',
        element: Inbox,
        protected: true,
      },
      {
        path: 'inbox',
        element: Inbox,
        protected: true,
      },
      // ... 更多子路由
    ],
  },
];
```

## 使用方法

### 1. 添加新路由

在 `src/config/routes.ts` 中添加新的路由配置：

```typescript
// 1. 创建懒加载组件
const NewPage = lazy(() =>
  import('@/features/momentum/pages/NewPage').then(module => ({
    default: module.NewPage,
  }))
);

// 2. 添加到相应的路由配置中
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/',
    element: Inbox,
    protected: true,
    children: [
      // ... 现有路由
      {
        path: 'new-page',
        element: NewPage,
        protected: true,
      },
    ],
  },
];
```

### 2. 路由渲染

应用使用 `RouteRenderer` 组件来渲染路由：

```typescript
import { RouteRenderer } from '@/components/routing/RouteRenderer';
import { publicRoutes, protectedRoutes } from '@/config/routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
          <RouteRenderer
            publicRoutes={publicRoutes}
            protectedRoutes={protectedRoutes}
          />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
```

## 特性

### 1. 懒加载

所有页面组件都使用懒加载，提高应用性能：

```typescript
const Page = lazy(() =>
  import('@/features/momentum/pages/Page').then(module => ({
    default: module.Page,
  }))
);
```

### 2. 身份验证

路由自动根据 `protected` 属性进行身份验证：

- `protected: false` - 公开路由，无需身份验证
- `protected: true` - 受保护路由，需要身份验证

### 3. 嵌套路由

支持嵌套路由结构，子路由会自动继承父路由的配置。

### 4. 类型安全

使用 TypeScript 提供完整的类型安全支持。

## 工具函数

### 获取路由路径

```typescript
import { getRoutePaths } from '@/config/routes';

const paths = getRoutePaths(); // 返回所有路由路径
```

### 获取受保护路由

```typescript
import { getProtectedRoutes } from '@/config/routes';

const protectedRoutes = getProtectedRoutes();
```

### 获取公开路由

```typescript
import { getPublicRoutes } from '@/config/routes';

const publicRoutes = getPublicRoutes();
```

## 最佳实践

1. **路由命名**: 使用 kebab-case 命名路由路径
2. **组件导入**: 始终使用懒加载导入页面组件
3. **类型定义**: 为新的路由配置添加适当的类型定义
4. **文档更新**: 添加新路由时更新相关文档

## 扩展性

路由配置系统设计为可扩展的，可以轻松添加：

- 路由元数据
- 权限控制
- 路由守卫
- 动态路由

通过这种集中化的配置管理，路由的维护变得更加简单和可预测。