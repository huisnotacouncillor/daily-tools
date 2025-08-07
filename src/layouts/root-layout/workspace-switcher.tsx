import { useMemo } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useAuth } from '@/hooks';
import type { Workspace } from '@/types';
import { WorkspaceAvatar } from '../../features/auth/components/workspace-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@ui/sidebar';

export function WorkspaceSwitcher() {
  const { user, switchWorkspace } = useAuth();
  const { isMobile } = useSidebar();

  const currentWorkspace =
    user?.workspaces?.find(
      workspace => workspace.id === user?.current_workspace_id
    ) || null;
  const workspaces = useMemo(() => user?.workspaces || [], [user]);

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    if (workspace.id === user?.current_workspace_id) {
      try {
        await switchWorkspace(workspace.id);
      } catch (error) {
        console.error('Failed to switch workspace:', error);
      }
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <WorkspaceAvatar name={currentWorkspace?.name} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentWorkspace?.name}
                </span>
                <span className="truncate text-xs">Workspace</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg overflow-x-hidden"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map(workspace => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => handleWorkspaceSelect(workspace)}
                className="gap-2 p-2 overflow-x-hidden w-full"
              >
                <div className="flex items-center gap-2 flex-auto overflow-x-hidden">
                  <WorkspaceAvatar
                    className="w-5 h-5 shrink-0 rounded-sm text-xs"
                    name={workspace.name}
                  />
                  <div className="flex-auto overflow-hidden truncate">
                    {workspace.name}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Check
                    className={`size-4 ${
                      workspace.id === currentWorkspace?.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                  {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
