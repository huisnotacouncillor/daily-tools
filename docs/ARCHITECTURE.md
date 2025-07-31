# 项目架构文档

## 📁 目录结构

```
src/
├── 📁 components/           # 通用 UI 组件
│   ├── 📁 layout/          # 布局组件
│   └── 📁 ui/              # shadcn/ui 基础组件
├── 📁 features/            # 功能模块（按业务领域组织）
│   ├── 📁 auth/           # 认证功能模块
│   │   ├── 📁 components/ # 认证相关组件
│   │   └── 📄 index.ts    # 模块导出
│   └── 📁 momentum/       # Momentum 业务功能
│       ├── 📁 components/ # 业务组件
│       ├── 📁 pages/      # 页面组件
│       └── 📄 index.ts    # 模块导出
├── 📁 hooks/              # 自定义 React Hooks
├── 📁 locales/            # 国际化文件
├── 📁 providers/          # React Context Providers
├── 📁 services/           # 外部服务接口
├── 📁 stores/             # 状态管理（预留）
├── 📁 types/              # TypeScript 类型定义
├── 📁 utils/              # 工具函数
└── 📄 App.tsx             # 应用入口组件
```

## 🏗️ 架构原则

### 1. **按功能模块组织（Feature-based Organization）**
- 将相关的组件、页面、hooks 按业务功能分组
- 每个功能模块都有自己的 `index.ts` 导出文件
- 便于代码分割和团队协作

### 2. **分离关注点（Separation of Concerns）**
- **`components/`**: 通用 UI 组件，不包含业务逻辑
- **`features/`**: 业务功能，包含特定领域的组件和页面
- **`services/`**: 外部 API 调用和服务配置
- **`types/`**: 类型定义，统一管理数据结构
- **`utils/`**: 纯函数工具，无副作用

### 3. **清晰的依赖关系**
```
┌─────────────────┐
│   App.tsx       │
├─────────────────┤
│   Features      │ ← 业务功能模块
├─────────────────┤
│   Components    │ ← 通用组件
├─────────────────┤
│   Services      │ ← 外部服务
├─────────────────┤
│   Utils/Types   │ ← 基础工具
└─────────────────┘
```

## 📦 模块说明

### 🔐 Auth Feature (`features/auth/`)
- **责任**: 用户认证相关功能
- **组件**: `ProtectedRoute`, `UserMenu`
- **依赖**: `providers/auth`, `types/auth`

### 🚀 Momentum Feature (`features/momentum/`)
- **责任**: Momentum 应用的核心业务功能
- **页面**: Login, Inbox, Projects, Cycles, Roadmaps 等
- **组件**: IssueDetailSheet 等业务组件
- **依赖**: `services/api`, `types/momentum`

### 🎨 UI Components (`components/ui/`)
- **责任**: 基础 UI 组件（基于 shadcn/ui）
- **特点**: 无业务逻辑，高度可复用
- **依赖**: 仅依赖 `utils` 和基础库

### 🔄 Providers (`providers/`)
- **AuthProvider**: 认证状态管理
- **ThemeProvider**: 主题切换管理
- **特点**: 全局状态管理，Context API

### 🌐 Services (`services/`)
- **api.ts**: API 调用和数据获取
- **i18n.ts**: 国际化配置
- **特点**: 外部服务接口，副作用处理

### 📋 Types (`types/`)
- **统一类型定义**: Auth, Momentum, Theme 等
- **模块化导出**: 每个领域独立类型文件
- **中央导出**: `index.ts` 统一导出常用类型

## 🔧 开发指南

### 添加新功能
1. 在 `features/` 下创建新的功能目录
2. 添加相应的类型定义到 `types/`
3. 如需新的 API 接口，扩展 `services/`
4. 更新功能模块的 `index.ts` 导出

### 创建通用组件
1. 在 `components/ui/` 下创建组件
2. 确保组件无业务逻辑依赖
3. 添加适当的 TypeScript 类型

### 状态管理
- 全局状态使用 Context Providers
- 本地状态使用 React useState/useReducer
- 服务器状态使用 SWR

## 🎯 优势

1. **可维护性**: 模块化结构，职责清晰
2. **可扩展性**: 新功能独立开发，不影响现有代码
3. **可复用性**: 通用组件和工具函数高度复用
4. **类型安全**: 完整的 TypeScript 类型定义
5. **团队协作**: 功能模块可并行开发
6. **代码分割**: 支持按功能进行代码分割

## 📈 性能优化

- **懒加载**: 页面组件使用 React.lazy
- **代码分割**: Vite 配置了手动分块
- **依赖分离**: 按功能分离第三方库
- **缓存策略**: SWR 提供智能数据缓存