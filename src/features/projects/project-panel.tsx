import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { getInitials } from '@/utils';
import { Box, PersonStanding } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ui/tabs';
import { assignees } from '@/mock/assignee';
import { issueAPI } from '@/services/api';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@ui/scroll-area';

export function ProjectPanel() {
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
        <div className="flex items-center gap-2 px-4 py-6 border-b">
          <Box className="size-4" />
          <span className="text-sm font-medium">Projects</span>
        </div>
        <Tabs defaultValue="leads" className="flex flex-col flex-1 px-2 pt-3">
          <TabsList className="w-full p-0 h-7">
            <TabsTrigger
              value="leads"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Leads
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="flex-1 font-normal text-xs cursor-pointer"
            >
              Health
            </TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="p-0">
            <div className="flex flex-col mt-2 space-y-1">
              <div className="flex items-center px-2 gap-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                <div className="border border-dashed rounded-full flex items-center justify-center w-8 h-8">
                  <PersonStanding className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">No lead</span>
              </div>
              {assignees?.map(user => (
                <div
                  key={user.id}
                  className="flex items-center px-2 py-1 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                >
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
            value="health"
            className="p-4 text-center text-muted-foreground"
          >
            No Health
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
