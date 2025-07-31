import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  X,
  User,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  Play,
} from 'lucide-react';
import { IssuePriority, ProjectStatus } from '@/types/enum';
import type { CreateProjectForm, Project } from '@/types';
import type { AuthUser } from '@/types/auth';
import { priorityOptions, projectStatusOptions } from '../constants/index';
import { projectAPI } from '@/services/api';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects?: Project[];
  users?: AuthUser[];
}

export function CreateTeamDialog({
  open,
  onOpenChange,
  users = [],
}: CreateTeamDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Backlog);
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.None);
  const [assignee, setAssignee] = useState<AuthUser | null>(null);
  const [createMore, setCreateMore] = useState(false);

  const onHandleCreateProject = async () => {
    if (!name.trim()) return;

    const newProject: CreateProjectForm = {
      name: name.trim(),
      description: description.trim() || undefined,
      project_key: name.trim(),
      status,
      priority,
      owner: assignee || undefined,
    };

    const res = await projectAPI.createProject(newProject);
    console.log(res);

    if (createMore) {
      // 只清空标题和描述，保留其他设置
      setName('');
      setDescription('');
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setStatus(ProjectStatus.Backlog);
    setPriority(IssuePriority.None);
    setAssignee(null);
    setCreateMore(false);
    onOpenChange(false);
  };

  const currentStatus = projectStatusOptions.find(
    option => option.value === status
  );
  const currentPriority = priorityOptions.find(
    option => option.value === priority
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 flex flex-col">
        <DialogHeader className="flex items-center flex-row justify-between px-4 py-4">
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

        <div className="flex flex-col flex-auto">
          {/* 主要内容区域 */}
          <div className="flex-1 px-4 space-y-4">
            {/* 标题输入 */}
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('projectName')}
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
            <div className="flex items-center gap-2 pb-3">
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
                  {projectStatusOptions.map(option => (
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
                    <span>{t(`priority.${priority}`)}</span>
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
          <div className="flex items-center justify-between px-4 py-3 border-t">
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
              onClick={onHandleCreateProject}
              size="xs"
              disabled={!name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('createProject')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
