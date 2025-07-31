# 可拖动调整侧边栏功能

## 概述

`PageLayout` 组件现在支持通过拖动左边框来调整侧边栏宽度，基于 shadcn 的 `Resizable` 组件实现。

## 新特性

- ✅ 拖动调整侧边栏宽度
- ✅ 可视化拖动手柄
- ✅ 可配置最小/最大宽度限制
- ✅ 基于百分比的响应式设计
- ✅ 平滑的拖动体验

## API 变更

### 新的 Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultSidebarSize` | `number` | `25` | 侧边栏默认宽度（百分比） |
| `minSidebarSize` | `number` | `15` | 侧边栏最小宽度（百分比） |
| `maxSidebarSize` | `number` | `50` | 侧边栏最大宽度（百分比） |

### 已移除的 Props

- ~~`sidebarWidth`~~ - 替换为基于百分比的配置

## 使用示例

### 基本用法

```tsx
<PageLayout
  header={headerContent}
  sidebar={sidebarContent}
  defaultSidebarVisible={true}
  enableSidebarToggle={true}
  defaultSidebarSize={30} // 30% 宽度
  minSidebarSize={20}     // 最小 20%
  maxSidebarSize={45}     // 最大 45%
>
  {mainContent}
</PageLayout>
```

### 不同页面的配置示例

#### 1. MyIssues 页面 - 大侧边栏

```tsx
<PageLayout
  header={headerContent}
  sidebar={<IssuePanel />}
  defaultSidebarSize={30} // 30% - 适合显示详细信息
  minSidebarSize={20}
  maxSidebarSize={45}
>
  <IssueList />
</PageLayout>
```

#### 2. Inbox 页面 - 小侧边栏

```tsx
<PageLayout
  header={headerContent}
  sidebar={<IssueDetails />}
  defaultSidebarVisible={false} // 默认隐藏
  defaultSidebarSize={25} // 25% - 适合简单信息
  minSidebarSize={15}
  maxSidebarSize={40}
>
  <IssueTable />
</PageLayout>
```

#### 3. 紧凑布局

```tsx
<PageLayout
  header={headerContent}
  sidebar={<CompactPanel />}
  defaultSidebarSize={20} // 20% - 紧凑布局
  minSidebarSize={15}
  maxSidebarSize={30}     // 限制最大宽度
>
  <MainContent />
</PageLayout>
```

## 用户操作指南

### 如何调整侧边栏宽度

1. **找到拖动手柄**：侧边栏左边框有一个可视化的拖动手柄
2. **开始拖动**：鼠标悬停在手柄上，光标会变为调整大小图标
3. **拖动调整**：按住鼠标左键并拖动来调整宽度
4. **释放鼠标**：松开鼠标完成调整

### 视觉提示

- **拖动手柄**：带有垂直网格图标的小按钮
- **拖动区域**：整个分隔线都可以拖动
- **光标变化**：悬停时光标变为双向箭头
- **约束提示**：到达最小/最大限制时拖动停止

## 技术实现

### 使用的组件

- `ResizablePanelGroup` - 容器组件
- `ResizablePanel` - 主内容和侧边栏面板
- `ResizableHandle` - 拖动手柄

### 关键特性

1. **响应式设计**：使用百分比而非固定像素
2. **约束控制**：通过 `minSize` 和 `maxSize` 设置边界
3. **状态保持**：用户的调整在组件重新渲染时保持
4. **无障碍支持**：键盘导航和屏幕阅读器支持

## 最佳实践

### 1. 合理的默认值

```tsx
// 好的配置
defaultSidebarSize={25}  // 不会太大也不会太小
minSidebarSize={15}      // 确保内容可读
maxSidebarSize={40}      // 不占用过多主内容空间
```

### 2. 根据内容调整

- **详细信息面板**：30-40% 宽度
- **简单信息面板**：20-30% 宽度
- **工具面板**：15-25% 宽度

### 3. 响应式考虑

```tsx
// 不同屏幕尺寸的建议配置
const getSidebarConfig = (screenSize) => {
  if (screenSize === 'large') {
    return { default: 25, min: 15, max: 40 };
  } else if (screenSize === 'medium') {
    return { default: 30, min: 20, max: 45 };
  } else {
    return { default: 35, min: 25, max: 50 };
  }
};
```

## 注意事项

1. **性能**：大量内容时使用 `ScrollArea` 包装
2. **内容适配**：确保侧边栏内容在不同宽度下正常显示
3. **移动端**：在小屏幕上考虑禁用拖动或使用不同布局
4. **最小宽度**：不要设置过小的最小宽度，确保内容可读

## 故障排除

### 常见问题

**Q: 拖动手柄不显示？**
A: 检查是否正确导入了 `resizable` 组件，确保 `withHandle={true}`

**Q: 拖动没有反应？**
A: 确保父容器有明确的高度设置，检查是否有 CSS 冲突

**Q: 宽度限制不生效？**
A: 检查 `minSize` 和 `maxSize` 配置，确保值在合理范围内

**Q: 布局错乱？**
A: 确保 `ResizablePanelGroup` 的父容器设置了正确的高度和宽度