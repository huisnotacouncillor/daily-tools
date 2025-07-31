# Momentum 登录系统

这个项目实现了一个完整的用户认证系统，使用 SWR 进行数据请求管理。

## 功能特性

### 🔐 认证功能
- **用户注册**: 支持邮箱、用户名、姓名和密码注册
- **用户登录**: 使用邮箱和密码登录
- **自动认证**: 基于 JWT token 的自动认证
- **用户登出**: 安全的登出功能
- **受保护路由**: 未登录用户自动重定向到登录页面

### 🎨 用户界面
- **现代化设计**: 使用 Tailwind CSS 和 shadcn/ui 组件
- **响应式布局**: 适配不同屏幕尺寸
- **表单验证**: 使用 Zod 进行客户端表单验证
- **加载状态**: 优雅的加载和错误状态处理
- **用户菜单**: 显示用户信息和登出选项

### 🔄 数据管理
- **SWR 集成**: 使用 SWR 进行数据获取和缓存
- **自动重试**: 网络错误时自动重试
- **实时同步**: 数据变更时自动更新
- **错误处理**: 完善的错误处理机制

## 项目结构

```
src/
├── lib/
│   ├── api.ts              # API 工具和 SWR 配置
│   ├── auth-context.tsx    # 认证上下文提供者
│   └── auth-hooks.ts       # 认证相关 hooks
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx  # 受保护路由组件
│   │   └── UserMenu.tsx        # 用户菜单组件
│   └── layout/
│       └── MomentumLayout.tsx  # 主布局组件
└── pages/
    └── momentum/
        ├── Login.tsx       # 登录/注册页面
        └── TestAuth.tsx    # 认证测试页面
```

## 使用方法

### 1. 启动后端服务

确保后端服务在 `http://localhost:8000` 运行：

```bash
cd momentum_backend
cargo run
```

### 2. 启动前端服务

```bash
cd momentum-frontend
pnpm dev
```

### 3. 访问应用

- **登录页面**: `http://localhost:5173/login`
- **主应用**: `http://localhost:5173/` (需要登录)
- **测试页面**: `http://localhost:5173/test-auth` (需要登录)

## API 接口

### 认证接口

- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `POST /auth/refresh` - 刷新 token
- `POST /auth/logout` - 用户登出
- `GET /auth/profile` - 获取用户信息

### 用户接口

- `GET /users` - 获取用户列表

## 技术栈

### 前端
- **React 19** - 用户界面框架
- **TypeScript** - 类型安全
- **SWR** - 数据获取和缓存
- **React Router** - 路由管理
- **React Hook Form** - 表单管理
- **Zod** - 表单验证
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Lucide React** - 图标库

### 后端
- **Rust** - 后端语言
- **Axum** - Web 框架
- **Diesel** - ORM
- **PostgreSQL** - 数据库
- **JWT** - 认证机制

## 开发指南

### 添加新的受保护页面

1. 创建页面组件
2. 在 `App.tsx` 中添加路由
3. 确保路由在 `ProtectedRoute` 内部

```tsx
// 在 App.tsx 中添加
<Route path="new-page" element={<NewPage />} />
```

### 使用认证上下文

```tsx
import { useAuthContext } from '@/lib/auth-hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext();

  // 使用认证功能
}
```

### 使用 SWR 获取数据

```tsx
import { useUsers } from '@/lib/api';

function MyComponent() {
  const { users, isLoading, isError } = useUsers();

  // 使用数据
}
```

## 环境配置

确保后端环境变量正确配置：

```env
DATABASE_URL=postgresql://username:password@localhost/momentum
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## 故障排除

### 常见问题

1. **CORS 错误**: 确保后端 CORS 配置正确
2. **认证失败**: 检查 JWT_SECRET 配置
3. **数据库连接**: 确保 PostgreSQL 服务运行
4. **Redis 连接**: 确保 Redis 服务运行

### 调试技巧

1. 打开浏览器开发者工具查看网络请求
2. 检查 localStorage 中的 token
3. 查看后端日志输出
4. 使用测试页面验证功能

## 安全考虑

- JWT token 存储在 localStorage 中
- 密码使用 bcrypt 加密
- API 请求使用 HTTPS（生产环境）
- 实现了 token 刷新机制
- 登出时清除所有认证信息

## 下一步计划

- [ ] 添加 OAuth 登录支持
- [ ] 实现密码重置功能
- [ ] 添加双因素认证
- [ ] 实现用户权限管理
- [ ] 添加审计日志
- [ ] 优化性能（懒加载、代码分割）