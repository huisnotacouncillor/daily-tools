import { Button } from '@ui/button';
import { useAuth } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { getInitials } from '@/utils';
import { Star } from 'lucide-react';
import { Badge } from '@ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ui/tabs';
import { useTranslation } from 'react-i18next';
import { assignees } from '@/mock/assignee';
import { priorityOptions } from '@/constants';
import { issueAPI } from '@/services/api';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@ui/scroll-area';

export function IssuePanel() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [priorities, setPriorities] = useState<string[]>([]);
  console.log(priorities);

  // 获取优先级
  const fetchPriorities = async () => {
    const response = await issueAPI.getIssuePriorities();
    setPriorities(response?.data ?? []);
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col shrink-0">
        <div className="flex flex-col gap-2 p-4 border-b">
          <Badge variant="secondary" className="text-lg font-bold">
            Active issues
          </Badge>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name ?? '')}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {user?.name ?? 'Guest'}
              </span>
            </div>
            <Button variant="ghost" size="icon">
              <Star />
            </Button>
          </div>
        </div>
        <Tabs
          defaultValue="assignees"
          className="flex flex-col flex-1 px-2 pt-3"
        >
          <TabsList className="w-full p-0 h-7">
            <TabsTrigger
              value="priority"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Priority
            </TabsTrigger>
            <TabsTrigger
              value="assignees"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Assignees
            </TabsTrigger>
            <TabsTrigger
              value="labels"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Labels
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assignees" className="p-0">
            <div className="flex flex-col mt-2 space-y-1">
              {assignees?.map(user => (
                <div key={user.id} className="flex items-center px-2">
                  <Avatar className="mr-2">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(user?.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user?.name ?? 'Guest'}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent
            value="labels"
            className="p-4 text-center text-muted-foreground"
          >
            No labels
          </TabsContent>
          <TabsContent
            value="priority"
            className="p-0 text-center text-muted-foreground"
          >
            {priorityOptions.map(option => {
              return (
                <div className="flex items-center justify-between text-md gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-accent">
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{t(`priority.${option.value}`)}</span>
                  </div>
                  <div>1</div>
                </div>
              );
            })}
          </TabsContent>
          <TabsContent
            value="projects"
            className="p-4 text-center text-muted-foreground"
          >
            No Projects
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
