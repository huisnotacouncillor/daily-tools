import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { Toggle } from '@ui/toggle';
import { useSidebar } from '@/hooks';
import { Link, PanelRight, Plus } from 'lucide-react';
import { CreateProjectDialog } from './create-project-dialog';
import { useState } from 'react';

export const ProjectHeader = () => {
  const { toggleRightSidebar, rightSidebarVisible } = useSidebar();
  const [open, setOpen] = useState(false);
  const onHandleCopyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex items-center justify-between pl-8 pr-7 border-b h-10 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Projects</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" onClick={onHandleCopyCurrentUrl}>
          <Link className="size-4" />
        </Button>
        <Button variant="ghost" size="xs" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add Project
        </Button>
        <Separator orientation="vertical" className="min-h-3" />
        <Toggle
          variant="ghost"
          size="xs"
          pressed={rightSidebarVisible}
          onClick={toggleRightSidebar}
        >
          <PanelRight className="size-4" />
        </Toggle>
      </div>
      <CreateProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
