# SidebarProvider 架构文档

## 概述

`SidebarProvider` 是一个全局状态管理工具，用于控制 `PageLayout` 组件中左右侧边栏的显示和隐藏。这种架构实现了控制逻辑和视图的解耦，使得任何组件都可以控制侧边栏的状态。

## 架构优势

### 1. 逻辑和视图解耦
- 侧边栏的状态管理从 `PageLayout` 组件中提取出来
- 任何组件都可以通过 `useSidebar` hook 来控制侧边栏

### 2. 全局状态管理
- 在应用程序的任何地方都可以访问和修改侧边栏状态
- 状态在整个应用生命周期中持久化

### 3. 灵活的控制方式
- 提供多种控制方法：toggle、show、hide、set
- 支持左右两个独立的侧边栏

## 使用方法

### 1. Provider 包装

```tsx
import { SidebarProvider } from '@/providers';

function App() {
  return (
    <SidebarProvider
      defaultLeftSidebarVisible={true}
      defaultRightSidebarVisible={true}
    >
      {/* 你的应用组件 */}
    </SidebarProvider>
  );
}
```

### 2. 在组件中使用

```tsx
import { useSidebar } from '@/providers';

function MyComponent() {
  const {
    leftSidebarVisible,
    rightSidebarVisible,
    toggleLeftSidebar,
    toggleRightSidebar,
    showLeftSidebar,
    hideLeftSidebar,
    showRightSidebar,
    hideRightSidebar,
    setLeftSidebarVisible,
    setRightSidebarVisible,
  } = useSidebar();

  return (
    <div>
      <button onClick={toggleLeftSidebar}>
        {leftSidebarVisible ? '隐藏' : '显示'}左侧栏
      </button>
      <button onClick={toggleRightSidebar}>
        {rightSidebarVisible ? '隐藏' : '显示'}右侧栏
      </button>
    </div>
  );
}
```

### 3. PageLayout 使用

```tsx
import { PageLayout } from '@/components/layout/PageLayout';

function MyPage() {
  return (
    <PageLayout
      header={<MyHeader />}
      leftSidebar={<MyLeftSidebar />}
      sidebar={<MyRightSidebar />}
      enableLeftSidebarToggle={true}
      enableSidebarToggle={true}
    >
      <MyContent />
    </PageLayout>
  );
}
```

## API 参考

### SidebarProvider Props

```tsx
interface SidebarProviderProps {
  children: ReactNode;
  defaultLeftSidebarVisible?: boolean;  // 默认: true
  defaultRightSidebarVisible?: boolean; // 默认: true
}
```

### useSidebar Hook

```tsx
interface SidebarContextType {
  // 状态
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;

  // 切换方法
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;

  // 设置方法
  setLeftSidebarVisible: (visible: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;

  // 便捷方法
  showLeftSidebar: () => void;
  hideLeftSidebar: () => void;
  showRightSidebar: () => void;
  hideRightSidebar: () => void;
}
```

## 迁移指南

### 从旧的 PageLayout 迁移

**之前:**
```tsx
<PageLayout
  defaultSidebarVisible={true}
  defaultLeftSidebarVisible={false}
  // ...其他 props
>
  {content}
</PageLayout>
```

**之后:**
```tsx
// 1. 在 App.tsx 中添加 SidebarProvider
<SidebarProvider
  defaultRightSidebarVisible={true}
  defaultLeftSidebarVisible={false}
>
  <App />
</SidebarProvider>

// 2. 移除相关的 props
<PageLayout
  // 移除: defaultSidebarVisible, defaultLeftSidebarVisible
  // ...其他 props
>
  {content}
</PageLayout>
```

## 最佳实践

### 1. 统一的状态管理
- 使用 `SidebarProvider` 来统一管理所有侧边栏状态
- 避免在页面组件中维护本地侧边栏状态

### 2. 语义化的方法命名
- 使用 `showLeftSidebar()` 而不是 `setLeftSidebarVisible(true)`
- 使用 `toggleRightSidebar()` 进行状态切换

### 3. 条件渲染优化
- 在 `PageLayout` 中，只有当侧边栏可见且有内容时才渲染
- 使用 `enableSidebarToggle` 来控制是否显示切换按钮

## 示例场景

### 1. 全局快捷键控制
```tsx
function GlobalKeyboardShortcuts() {
  const { toggleLeftSidebar, toggleRightSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey + e.key === 'b') {
        toggleLeftSidebar();
      }
      if (e.ctrlKey + e.key === 'r') {
        toggleRightSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleLeftSidebar, toggleRightSidebar]);

  return null;
}
```

### 2. 根据路由自动调整侧边栏
```tsx
function RouteBasedSidebar() {
  const location = useLocation();
  const { setRightSidebarVisible } = useSidebar();

  useEffect(() => {
    // 在特定路由隐藏右侧栏
    if (location.pathname === '/settings') {
      setRightSidebarVisible(false);
    }
  }, [location.pathname, setRightSidebarVisible]);

  return null;
}
```