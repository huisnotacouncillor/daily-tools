import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Switch } from '@ui/switch';
import { Label } from '@ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import {
  X,
  User,
  FolderOpen,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  Play,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleX,
} from 'lucide-react';
import { IssueStatus, IssuePriority } from '@/types/enum';
import type { Issue, Project } from '@/types';
import type { AuthUser } from '@/types/auth';
import { priorityOptions } from '../../constants/index';

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateIssue: (issue: Partial<Issue>) => void;
  projects?: Project[];
  users?: AuthUser[];
}

export function CreateIssueDialog({
  open,
  onOpenChange,
  onCreateIssue,
  projects = [],
  users = [],
}: CreateIssueDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.Backlog);
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.None);
  const [assignee, setAssignee] = useState<AuthUser | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [createMore, setCreateMore] = useState(false);

  const handleCreateIssue = () => {
    if (!title.trim()) return;

    const newIssue: Partial<Issue> = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      assignee: assignee || undefined,
      project: project || undefined,
    };

    onCreateIssue(newIssue);

    if (createMore) {
      // 只清空标题和描述，保留其他设置
      setTitle('');
      setDescription('');
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(IssueStatus.Backlog);
    setPriority(IssuePriority.None);
    setAssignee(null);
    setProject(null);
    setCreateMore(false);
    onOpenChange(false);
  };

  const statusOptions: {
    value: IssueStatus;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: IssueStatus.Backlog,
      label: 'Backlog',
      icon: <CircleDashed className="h-4 w-4 text-gray-500" />,
    },
    {
      value: IssueStatus.Todo,
      label: 'Todo',
      icon: <Circle className="h-4 w-4 text-gray-500" />,
    },
    {
      value: IssueStatus.InProgress,
      label: 'In Progress',
      icon: <Circle className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: IssueStatus.InReview,
      label: 'In Review',
      icon: <Circle className="h-4 w-4 text-blue-500" />,
    },
    {
      value: IssueStatus.Done,
      label: 'Done',
      icon: <CircleCheck className="h-4 w-4 text-green-500" />,
    },
    {
      value: IssueStatus.Canceled,
      label: 'Canceled',
      icon: <CircleX className="h-4 w-4 text-gray-500" />,
    },
  ];

  const currentPriority = priorityOptions.find(
    option => option.value === priority
  );
  const currentStatus = statusOptions.find(option => option.value === status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-lg font-medium">
            {t('newIssue')}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* 主要内容区域 */}
          <div className="flex-1 px-6 space-y-4">
            {/* 标题输入 */}
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('issueTitle')}
              className="text-lg font-medium border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              autoFocus
            />

            {/* 描述输入 */}
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('addDescription')}
              className="min-h-[100px] border-none px-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            />

            {/* 属性选择器区域 */}
            <div className="flex items-center gap-2 py-4">
              {/* 状态选择器 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {currentStatus?.icon}
                    <span>{t(`status.${status}`)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {statusOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setStatus(option.value)}
                      className="flex items-center gap-2"
                    >
                      {option.icon}
                      <span>{t(`status.${option.value}`)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 优先级选择器 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {currentPriority?.icon}
                    <span>{t('priority')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {priorityOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setPriority(option.value)}
                      className="flex items-center gap-2"
                    >
                      {option.icon}
                      <span>{t(`priority.${option.value}`)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 分配者选择器 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {assignee ? (
                      <>
                        <Avatar className="h-4 w-4">
                          <AvatarImage
                            src={assignee.avatar_url}
                            alt={assignee.name}
                          />
                          <AvatarFallback className="text-xs">
                            {assignee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{assignee.name}</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span>{t('assignee')}</span>
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => setAssignee(null)}>
                    <User className="h-4 w-4 mr-2" />
                    <span>{t('unassigned')}</span>
                  </DropdownMenuItem>
                  {users.map(user => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => setAssignee(user)}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 项目选择器 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>{project ? project.name : t('project')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => setProject(null)}>
                    <span>{t('noProject')}</span>
                  </DropdownMenuItem>
                  {projects.map(proj => (
                    <DropdownMenuItem
                      key={proj.id}
                      onClick={() => setProject(proj)}
                    >
                      <span>{proj.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 其他操作按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Play className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 底部操作区域 */}
          <div className="flex items-center justify-between p-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="create-more"
                checked={createMore}
                onCheckedChange={setCreateMore}
              />
              <Label
                htmlFor="create-more"
                className="text-sm text-muted-foreground"
              >
                {t('createMore')}
              </Label>
            </div>

            <Button
              onClick={handleCreateIssue}
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('createIssue')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
