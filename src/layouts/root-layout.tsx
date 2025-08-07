import { AppSidebar } from '@/layouts/root-layout/app-sidebar';
import { PageLoading } from '@/components/loader/page-loading';
import { SidebarInset, SidebarProvider } from '@ui/sidebar';
import { CreateIssueDialog } from '@/components/common/create-issue-dialog';
import type { Issue } from '@/types';
import { Suspense, memo, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const RootLayout = memo(function RootLayout() {
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);

  const handleCreateIssue = (issue: Partial<Issue>) => {
    console.log('Creating issue:', issue);
    // TODO: Implement actual issue creation logic
  };

  // Keyboard shortcut for creating new issue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only trigger if not focused on an input/textarea/contenteditable
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.getAttribute('contenteditable') === 'true';

        if (!isInputActive) {
          e.preventDefault();
          setIsCreateIssueOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <SidebarProvider>
      {/* Left Sidebar */}
      <AppSidebar />

      <SidebarInset>
        <main className="flex-auto overflow-hidden bg-muted/20">
          <div className="h-full overflow-hidden">
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>

      {/* Create Issue Dialog */}
      <CreateIssueDialog
        open={isCreateIssueOpen}
        onOpenChange={setIsCreateIssueOpen}
        onCreateIssue={handleCreateIssue}
      />
    </SidebarProvider>
  );
});
