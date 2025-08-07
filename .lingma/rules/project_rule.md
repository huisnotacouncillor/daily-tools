# Momentum 项目规则和编码规范

## 技术栈

1. **核心框架**: React 19 (函数组件 + Hooks)
2. **语言**: TypeScript (严格模式)
3. **构建工具**: Vite
4. **包管理**: pnpm
5. **路由**: React Router DOM v7
6. **样式**: Tailwind CSS v4 + CSS Modules
7. **UI组件库**: Radix UI + 自定义shadcn/ui组件
8. **状态管理**: React Hooks (原生) + SWR (数据获取)
9. **表单处理**: React Hook Form + Zod (验证)
10. **测试**: Vitest + Testing Library
11. **国际化**: i18next + react-i18next

## 项目结构约定

```
src/
├── components/           # 可复用的UI组件
│   ├── common/          # 通用业务组件 (可在多个feature间复用)
│   ├── loader/          # 加载相关组件
│   ├── routing/         # 路由相关组件
│   └── ui/              # 基础UI组件 (shadcn/ui风格)
├── config/              # 应用配置文件
├── constants/           # 常量定义
├── contexts/            # React Context
├── features/            # 功能模块 (按业务功能划分)
├── hooks/               # 自定义Hooks
├── layouts/             # 页面布局组件
├── locales/             # 国际化资源文件
├── mock/                # 模拟数据
├── pages/               # 路由页面组件
├── providers/           # React Providers
├── services/            # 服务层 (API调用等)
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

## 命名规范

1. **文件命名**:
   - 组件文件: kebab-case (例如: `user-profile.tsx`)
   - 工具文件: kebab-case (例如: `date-utils.ts`)
   - 配置文件: kebab-case (例如: `api-config.ts`)

2. **组件命名**:
   - PascalCase (例如: `UserProfile`)
   - 文件名与组件名保持一致

3. **变量命名**:
   - 普通变量: camelCase (例如: `userProfile`)
   - 常量: UPPER_SNAKE_CASE (例如: `MAX_RETRY_COUNT`)
   - 布尔值变量: 以is/has/can等开头 (例如: `isLoading`, `hasPermission`)

4. **函数命名**:
   - camelCase (例如: `getUserData`)
   - 事件处理函数: 以handle开头 (例如: `handleClick`)
   - 自定义Hooks: 以use开头 (例如: `useAuth`)

## 组件开发规范

1. **优先使用函数组件和Hooks**
2. **组件尽可能保持小而专一**
3. **合理使用Props类型定义**
4. **使用React.memo优化性能**
5. **避免在组件中直接使用业务逻辑，应抽象到services层**

## 样式规范

1. **主要使用Tailwind CSS**
2. **组件样式类名使用`cn()`工具函数合并**
3. **避免使用内联样式**
4. **需要自定义样式时使用CSS Modules**
5. **主题切换依赖.dark类名**

## TypeScript规范

1. **启用严格模式**
2. **所有组件和函数都需要类型定义**
3. **避免使用any类型**
4. **合理使用泛型**
5. **接口命名使用PascalCase，通常以I开头 (例如: `IUser`)**
6. **类型定义统一放在types目录下**

## 路由规范

1. **页面组件放在pages目录**
2. **路由配置在config/routes.ts中统一管理**
3. **使用懒加载优化性能**
4. **受保护路由需要通过认证检查**

## 数据获取和状态管理

1. **使用SWR进行数据获取和缓存**
2. **API调用统一放在services目录**
3. **复杂状态使用自定义Hooks管理**
4. **避免在组件中直接发起网络请求**

## 测试规范

1. **使用Vitest进行单元测试**
2. **使用Testing Library进行组件测试**
3. **关键业务逻辑和组件需要编写测试**
4. **测试文件放在对应组件或功能目录下**

## 国际化规范

1. **使用i18next进行国际化**
2. **所有用户可见文本需要支持国际化**
3. **语言资源文件放在locales目录**
4. **默认支持中英文**

## Git提交规范

1. **提交信息使用英文**
2. **遵循 conventional commits 规范**
3. **提交前确保代码通过lint检查**
4. **功能开发使用feature分支**

## 性能优化

1. **合理使用React.memo避免不必要的重渲染**
2. **使用懒加载减少初始包大小**
3. **图片资源需要压缩和适当的格式**
4. **避免在渲染函数中创建新对象或函数**

## 代码质量

1. **使用ESLint和Prettier保证代码风格一致**
2. **复杂逻辑需要添加注释**
3. **删除无用代码和注释**
4. **保持组件和函数的单一职责**