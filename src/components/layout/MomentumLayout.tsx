import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenu, WorkspaceSwitcher } from '@/features/auth';
import { CreateIssueDialog } from '@/features/momentum';
import type { Issue } from '@/types';
import {
  Inbox,
  AlertCircle,
  Calendar,
  FolderOpen,
  Map,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navigationItems = [
  {
    name: 'inbox',
    path: '/inbox',
    icon: Inbox,
    description: 'nav.inbox.desc',
  },
  {
    name: 'myissues',
    path: '/my-issues',
    icon: AlertCircle,
    description: 'nav.myissues.desc',
  },
  {
    name: 'teams',
    path: '/teams',
    icon: FolderOpen,
    description: 'nav.projects.desc',
  },
  {
    name: 'projects',
    path: '/projects',
    icon: FolderOpen,
    description: 'nav.projects.desc',
  },
  {
    name: 'cycles',
    path: '/cycles',
    icon: Calendar,
    description: 'nav.cycles.desc',
  },
  {
    name: 'roadmaps',
    path: '/roadmaps',
    icon: Map,
    description: 'nav.roadmaps.desc',
  },
];

export function MomentumLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleCreateIssue = (issue: Partial<Issue>) => {
    console.log('Creating issue:', issue);
    // TODO: Implement actual issue creation logic
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

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

  const currentView =
    navigationItems.find(item => item.path === location.pathname) ||
    navigationItems[0];

  return (
    <TooltipProvider>
      <div className="h-screen w-full overflow-hidden flex bg-background">
        {/* Left Sidebar */}
        <div
          className={`bg-card border-r transition-all duration-200 resize-x ${
            isCollapsed ? 'w-16' : ''
          }`}
          style={{ width: isCollapsed ? 64 : sidebarWidth }}
        >
          <div className="h-full flex flex-col">
            {/* Workspace Header */}
            <div>
              <WorkspaceSwitcher isCollapsed={isCollapsed} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2">
              <div className="space-y-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                            isActive
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'text-muted-foreground hover:text-accent-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {!isCollapsed && (
                            <span className="ml-3">
                              {t(`nav.${item.name}.label`)}
                            </span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          <p>{t(`nav.${item.name}.label`)}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Resize Handle */}
          {!isCollapsed && (
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors"
              onMouseDown={handleMouseDown}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-12 py-1.5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              {/* Collapse Button */}
              <Button
                variant="ghost"
                size="xs"
                className="w-6 h-6 rounded-full border bg-background"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronLeft className="h-3 w-3" />
                )}
              </Button>
              <h1 className="text-lg font-semibold">
                {t(`nav.${currentView.name}.label`)}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* New Issue Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsCreateIssueOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('issue.newIssue')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('issue.shortcutC')}</p>
                </TooltipContent>
              </Tooltip>

              {/* User Menu */}
              <UserMenu />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-auto overflow-hidden bg-muted/20">
            <div className="h-full flex-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Create Issue Dialog */}
      <CreateIssueDialog
        open={isCreateIssueOpen}
        onOpenChange={setIsCreateIssueOpen}
        onCreateIssue={handleCreateIssue}
      />
    </TooltipProvider>
  );
}
