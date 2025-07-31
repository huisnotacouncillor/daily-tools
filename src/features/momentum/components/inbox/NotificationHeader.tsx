import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, ListFilter, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotificationHeader = () => {
  const { t } = useTranslation();

  const handleDeleteAll = () => {
    if (window.confirm(t('inbox.confirmClearAll'))) {
      // TODO: 实现删除所有通知的逻辑
      console.log('删除所有通知');
    }
  };

  const handleDeleteAllRead = () => {
    if (window.confirm(t('inbox.confirmClearAllRead'))) {
      // TODO: 实现删除所有已读通知的逻辑
      console.log('删除所有已读通知');
    }
  };

  const handleDeleteAllCompleted = () => {
    if (window.confirm(t('inbox.confirmClearAllCompleted'))) {
      // TODO: 实现删除所有已完成通知的逻辑
      console.log('删除所有已完成通知');
    }
  };

  return (
    <div className="flex items-center justify-between h-10 px-3 border-b shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Inbox</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="2xs" variant="ghost" className="size-6">
              <Ellipsis className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-fit">
            <DropdownMenuItem
              onClick={handleDeleteAll}
              className="text-muted-foreground text-sm hover:text-foreground cursor-pointer"
            >
              <Trash2 className="text-sm" />
              {t('inbox.clearAll')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteAllRead}
              className="text-muted-foreground text-sm hover:text-foreground cursor-pointer"
            >
              <Trash2 className="text-sm" />
              {t('inbox.clearAllRead')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteAllCompleted}
              className="text-muted-foreground text-sm hover:text-foreground cursor-pointer"
            >
              <Trash2 className="text-sm" />
              {t('inbox.clearAllCompleted')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button size="2xs" variant="ghost" className="size-6">
          <ListFilter />
        </Button>
        <Button size="2xs" variant="ghost" className="size-6">
          <SlidersHorizontal />
        </Button>
      </div>
    </div>
  );
};
