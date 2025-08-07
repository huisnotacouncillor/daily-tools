import { Button } from '@ui/button';
import { Link, Plus } from 'lucide-react';
import { CreateTeamDialog } from './create-team-dialog';
import { useState } from 'react';

export const TeamHeader = () => {
  const [open, setOpen] = useState(false);
  const onHandleCopyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex items-center justify-between pl-8 pr-7 border-b h-10 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Teams</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" onClick={onHandleCopyCurrentUrl}>
          <Link className="size-4" />
        </Button>
        <Button variant="ghost" size="xs" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add Team
        </Button>
      </div>
      <CreateTeamDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};
