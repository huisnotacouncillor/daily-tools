# ⚠️ 主题切换说明
本项目 Tailwind CSS 主题切换依赖 .dark class，请确保 tailwind.config.js 配置了 darkMode: 'class'。

## tailwind.config.js 示例
```js
theme: {},
darkMode: 'class', // 必须为 class
```

# Momentum - 现代化项目管理应用

Momentum 是一个简洁、高效、以创造者为中心的项目管理工具，采用暗色模式设计，深受 shadcn/ui 美学影响。

## 🎨 设计理念

- **简洁高效**: 专注于核心功能，减少干扰
- **以创造者为中心**: 为开发者和产品团队量身定制
- **现代化界面**: 采用 shadcn/ui 组件库，确保一致性和美观性
- **暗色模式优先**: 提供舒适的视觉体验

## ✨ 主要功能

### 1. 主应用布局 (The Shell)
- **可调整大小的侧边栏**: 默认 240px，支持拖拽调整
- **工作空间管理**: 显示当前工作空间信息
- **全局导航**: 收件箱、我的问题、周期、项目、路线图
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

### 5. 项目 (Projects)
- 项目概览页面
- 进度条显示项目完成度
- 标签页切换：问题、简报、更新
- 项目负责人和目标日期信息

### 6. 路线图 (Roadmaps)
- 高层次战略规划视图
- 类似甘特图的时间轴布局
- 按季度划分，支持项目状态可视化
- 悬停显示项目详细信息

### 7. 问题详情 (Issue Detail)
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

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **路由**: React Router DOM
- **图标**: Lucide React
- **状态管理**: React Hooks
- **包管理**: pnpm

## 📁 项目结构

```
src/
├── components/
│   ├── layout/
│   │   └── MomentumLayout.tsx    # 主应用布局
│   ├── momentum/
│   │   └── IssueDetailSheet.tsx  # 问题详情抽屉
│   └── ui/                       # shadcn/ui 组件
├── pages/
│   └── momentum/
│       ├── Inbox.tsx             # 收件箱页面
│       ├── MyIssues.tsx          # 我的问题页面
│       ├── Cycles.tsx            # 周期看板页面
│       ├── Projects.tsx          # 项目页面
│       └── Roadmaps.tsx          # 路线图页面
├── App.tsx                       # 应用入口
└── main.tsx                      # 主入口文件
```

## 🎯 核心特性

### 键盘操作支持
- 表格行导航：↑↓ 键选择，Enter 键打开详情
- 快捷键提示：新建问题 (C)

### 响应式设计
- 支持侧边栏折叠/展开
- 移动端友好的布局

### 交互体验
- 悬停状态反馈
- 平滑的过渡动画
- 直观的拖拽操作

### 数据可视化
- 燃起图显示进度
- 甘特图式路线图
- 状态和优先级的颜色编码

## 🔧 自定义配置

### 主题配置
应用使用 Tailwind CSS 的暗色主题，可以在 `tailwind.config.js` 中自定义颜色和样式。

### 组件配置
所有 shadcn/ui 组件都可以通过 `components.json` 进行配置。

## 📝 开发说明

### 添加新页面
1. 在 `src/pages/momentum/` 创建新页面组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/components/layout/MomentumLayout.tsx` 中添加导航项

### 添加新组件
1. 在 `src/components/momentum/` 创建新组件
2. 使用 shadcn/ui 组件作为基础
3. 遵循现有的设计模式

### 数据管理
当前使用模拟数据，实际项目中可以集成：
- REST API
- GraphQL
- 状态管理库 (Zustand, Redux Toolkit)
- 实时数据 (WebSocket)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

**Momentum** - 让项目管理更简单、更高效。
