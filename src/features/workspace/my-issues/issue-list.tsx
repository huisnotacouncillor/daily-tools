import { Badge } from '@ui/badge';
import { PrioritySelector } from '@/components/common/priority-selector';
import { StatusSelector } from '@/components/common/status-selector';
import type { Issue } from '@/types';
import type { IssuePriority, IssueStatus } from '@/types/enum';
import { ScrollArea } from '@ui/scroll-area';

interface IssueListProps {
  issues: Issue[];
  selectedRow: string | null;
  onRowClick: (id: string) => void;
  onPriorityChange: (id: string, priority: IssuePriority) => void;
  onStatusChange: (id: string, status: IssueStatus) => void;
}

export function IssueList({
  issues,
  selectedRow,
  onRowClick,
  onPriorityChange,
  onStatusChange,
}: IssueListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 h-full text-sm">
        {issues.map(issue => (
          <div
            key={issue.id}
            className={`pr-3 pl-8 py-2 cursor-pointer whitespace-nowrap transition-colors ${
              selectedRow === issue.id ? 'bg-primary/5' : 'hover:bg-muted/30'
            }`}
            onClick={() => onRowClick(issue.id)}
            tabIndex={0}
          >
            <div className="flex items-center gap-4">
              {/* Priority */}
              <div className="flex items-center min-w-[24px]">
                <PrioritySelector
                  priority={issue.priority}
                  onChange={priority =>
                    onPriorityChange(issue.id, priority as IssuePriority)
                  }
                />
              </div>
              {/* ID */}
              <div className="">
                <span className="font-mono text-sm text-muted-foreground">
                  {issue.id}
                </span>
              </div>
              {/* Status */}
              <div className="">
                <StatusSelector
                  status={issue.status}
                  onChange={status =>
                    onStatusChange(issue.id, status as IssueStatus)
                  }
                />
              </div>
              {/* Title */}
              <div
                className="min-w-0 flex-auto text-foreground truncate text-sm"
                title={issue.title}
              >
                {issue.title}
              </div>
              {/* Tags */}
              <div className="flex items-center gap-1 flex-wrap">
                {issue.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
