import type { ReactNode } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { cn } from '@/utils';
import { useSidebar } from '@/providers';

interface PageLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  leftSidebar?: ReactNode;
  header?: ReactNode;
  enableSidebarToggle?: boolean;
  enableLeftSidebarToggle?: boolean;
  defaultSidebarSize?: number; // 右侧栏百分比
  defaultLeftSidebarSize?: number; // 左侧栏百分比
  minSidebarSize?: number; // 最小百分比
  maxSidebarSize?: number; // 最大百分比
  minLeftSidebarSize?: number; // 左侧栏最小百分比
  maxLeftSidebarSize?: number; // 左侧栏最大百分比
  className?: string;
}

export function PageLayout({
  children,
  sidebar,
  leftSidebar,
  header,
  defaultSidebarSize = 0, // 右侧栏默认25%
  defaultLeftSidebarSize = 0, // 左侧栏默认30%
  // minSidebarSize = 15, // 右侧栏最小15%
  // maxSidebarSize = 50, // 右侧栏最大50%
  // minLeftSidebarSize = 20, // 左侧栏最小20%
  // maxLeftSidebarSize = 50, // 左侧栏最大50%
  className = '',
}: PageLayoutProps) {
  const { leftSidebarVisible, rightSidebarVisible } = useSidebar();

  const renderContent = () => {
    const hasLeftSidebar = leftSidebar && leftSidebarVisible;
    const hasRightSidebar = sidebar && rightSidebarVisible;

    if (hasLeftSidebar && hasRightSidebar) {
      // 三列布局
      return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar Panel */}
          <ResizablePanel
            defaultSize={defaultLeftSidebarSize}
            className="bg-card"
            style={{
              minWidth: '360px',
              maxWidth: '600px',
            }}
          >
            {leftSidebar}
          </ResizablePanel>

          {/* Left Resizable Handle */}
          <ResizableHandle withHandle={false} />

          <ResizablePanel className="flex flex-col flex-auto">
            {/* Header */}
            {header || null}
            <ResizablePanelGroup direction="horizontal" className="flex-auto">
              {/* Main Content Panel */}
              <ResizablePanel className="flex-auto">{children}</ResizablePanel>

              {/* Right Resizable Handle */}
              <ResizableHandle withHandle={false} />

              {/* Right Sidebar Panel */}
              <ResizablePanel
                defaultSize={defaultSidebarSize}
                className="bg-card"
                style={{
                  minWidth: '360px',
                  maxWidth: '600px',
                }}
              >
                {sidebar}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    } else if (hasLeftSidebar) {
      // 左侧栏 + 主内容
      return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar Panel */}
          <ResizablePanel
            defaultSize={defaultLeftSidebarSize}
            className="bg-card"
            style={{
              minWidth: '360px',
              maxWidth: '600px',
            }}
          >
            {leftSidebar}
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle={false} />

          {/* Main Content Panel */}
          <ResizablePanel className="flex-auto">
            {/* Header */}
            {header || null}
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    } else if (hasRightSidebar) {
      // 主内容 + 右侧栏（保持原有逻辑）
      return (
        <div className={cn('flex flex-col h-full', className)}>
          {/* Header */}
          {header || null}
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Main Content Panel */}
            <ResizablePanel className="flex-auto">{children}</ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle={false} />

            {/* Sidebar Panel */}
            <ResizablePanel
              defaultSize={defaultSidebarSize}
              className="bg-card"
              style={{
                minWidth: '360px',
                maxWidth: '600px',
              }}
            >
              {sidebar}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      );
    } else {
      // 只有主内容
      return (
        <div className={cn('flex flex-col h-full overflow-hidden', className)}>
          {/* Header */}
          {header || null}
          <div className="flex-auto overflow-hidden">{children}</div>
        </div>
      );
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Content Area */}
      <div className="flex-auto overflow-hidden">{renderContent()}</div>
    </div>
  );
}
