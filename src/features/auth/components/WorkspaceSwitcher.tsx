import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuthContext } from '@/hooks';
import type { Workspace } from '@/types';
import { WorkspaceAvatar } from './WorkspaceAvatar';

interface WorkspaceSwitcherProps {
  isCollapsed?: boolean;
}

export function WorkspaceSwitcher({
  isCollapsed = false,
}: WorkspaceSwitcherProps) {
  const { t } = useTranslation();
  const { user, switchWorkspace } = useAuthContext();
  const [open, setOpen] = useState(false);

  const currentWorkspace = user?.workspaces.find(
    workspace => workspace.id === user?.current_workspace_id
  );

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    if (workspace.id === user?.current_workspace_id) {
      try {
        await switchWorkspace(workspace.id);
        setOpen(false);
      } catch (error) {
        console.error('Failed to switch workspace:', error);
      }
    } else {
      setOpen(false);
    }
  };

  if (isCollapsed) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-2"
            title={currentWorkspace?.name}
          >
            <WorkspaceAvatar name={currentWorkspace?.name} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start" side="right">
          <WorkspaceList
            workspaces={user?.workspaces || []}
            currentWorkspace={currentWorkspace}
            onSelect={handleWorkspaceSelect}
            t={t}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-auto p-0 justify-start hover:bg-accent/50"
          title={currentWorkspace?.name}
        >
          <div className="flex items-center space-x-3 px-3 py-1.5 w-full min-w-0">
            <WorkspaceAvatar name={currentWorkspace?.name} />
            <div className="flex-1 text-left min-w-0">
              <h1 className="font-semibold text-sm truncate">
                {currentWorkspace?.name}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {t('workspace')}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <WorkspaceList
          workspaces={user?.workspaces || []}
          currentWorkspace={currentWorkspace}
          onSelect={handleWorkspaceSelect}
          t={t}
        />
      </PopoverContent>
    </Popover>
  );
}

interface WorkspaceListProps {
  workspaces: Workspace[];
  currentWorkspace?: Workspace;
  onSelect: (workspace: Workspace) => void;
  t: (key: string) => string;
}

function WorkspaceList({
  workspaces,
  currentWorkspace,
  onSelect,
  t,
}: WorkspaceListProps) {
  return (
    <div className="p-2">
      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
        {t('workspaces')}
      </div>
      <div className="space-y-1">
        {workspaces.map(workspace => (
          <Button
            key={workspace.id}
            variant="ghost"
            className="w-full justify-start h-auto p-2"
            onClick={() => onSelect(workspace)}
            title={workspace.name}
          >
            <div className="flex items-center space-x-3 w-full min-w-0">
              <WorkspaceAvatar name={workspace.name} size="sm" />
              <span className="flex-1 text-left text-sm truncate">
                {workspace.name}
              </span>
              {workspace.id === currentWorkspace?.id && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="border-t mt-2 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-2 text-muted-foreground"
          disabled
          title={t('createWorkspace')}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-6 h-6 shrink-0 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </div>
            <span className="text-sm truncate">{t('createWorkspace')}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
