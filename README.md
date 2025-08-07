# ⚠️ 主题切换说明
本项目 Tailwind CSS 主题切换依赖 .dark class，请确保 tailwind.config.js 配置了 darkMode: 'class'。

## tailwind.config.js 示例
```js
theme: {},
darkMode: 'class', // 必须为 class
```

# Momentum - 现代化项目管理应用

Momentum 是一个简洁、高效、以创造者为中心的项目管理工具，采用现代化界面设计，支持暗色模式，深受 shadcn/ui 美学影响。

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/react-19-blue)
![TypeScript](https://img.shields.io/badge/typescript-latest-blue)

## 🎨 设计理念

- **简洁高效**: 专注于核心功能，减少干扰
- **以创造者为中心**: 为开发者和产品团队量身定制
- **现代化界面**: 采用 shadcn/ui 组件库，确保一致性和美观性
- **暗色模式优先**: 提供舒适的视觉体验

## ✨ 主要功能

### 1. 主应用布局 (The Shell)
- **可调整大小的侧边栏**: 默认 240px，支持拖拽调整
- **工作空间管理**: 显示当前工作空间信息
- **全局导航**: 收件箱、我的问题、周期、项目、路线图、团队
- **顶部操作栏**: 新建问题按钮和用户菜单

### 2. 收件箱 (Inbox)
- 查看所有新问题
- 支持搜索和筛选
- 表格形式展示，信息密度高

### 3. 我的问题 (My Issues)
- 个人仪表盘，显示负责的问题
- 支持键盘导航 (↑↓ 键选择，Enter 键打开详情)
- 点击行可打开问题详情抽屉

### 4. 周期 (Cycles)
- 团队协作看板
- 燃起图显示完成进度
- 支持拖拽的问题卡片
- 五列布局：Backlog, Todo, In Progress, In Review, Done

### 5. 团队 (Teams)
- 团队管理功能
- 团队成员展示
- 团队筛选功能

### 6. 项目 (Projects)
- 项目概览页面
- 进度条显示项目完成度
- 标签页切换：问题、简报、更新
- 项目负责人和目标日期信息

### 7. 路线图 (Roadmaps)
- 高层次战略规划视图
- 类似甘特图的时间轴布局
- 按季度划分，支持项目状态可视化
- 悬停显示项目详细信息

### 8. 问题管理 (Issue Management)
- 右侧滑出的抽屉式详情页
- 支持 Markdown 格式的描述
- 可编辑的元数据（负责人、状态、优先级）
- 评论系统
- 标签管理

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 运行测试
```bash
# 运行测试
pnpm test

# 使用UI界面运行测试
pnpm test:ui

# 运行测试（单次）
pnpm test:run
```

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **路由**: React Router DOM v7
- **图标**: Lucide React
- **状态管理**: React Hooks
- **表单处理**: React Hook Form
- **数据验证**: Zod
- **包管理**: pnpm

## 📁 项目结构

```
src/
├── components/           # 公共组件
│   ├── common/          # 通用业务组件
│   ├── loader/          # 加载组件
│   ├── routing/         # 路由相关组件
│   └── ui/              # 基础UI组件（shadcn/ui）
├── config/              # 应用配置
├── constants/           # 常量定义
├── contexts/            # React上下文
├── features/            # 功能模块
│   ├── auth/            # 认证相关
│   ├── inbox/           # 收件箱功能
│   ├── my-issues/       # 我的问题功能
│   ├── projects/        # 项目管理功能
│   └── teams/           # 团队管理功能
├── hooks/               # 自定义Hooks
├── layouts/             # 页面布局
├── locales/             # 国际化文件
├── mock/                # 模拟数据
├── pages/               # 页面组件
├── providers/           # React Providers
├── services/            # 服务层
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助我们改进项目。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**Momentum** - 让项目管理更简单、更高效。
