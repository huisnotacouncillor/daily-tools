import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flame, ArrowUp, Minus, Copy, MessageSquare } from 'lucide-react';

interface IssueDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId?: string;
}

// 模拟问题详情数据
const mockIssueDetail = {
  id: 'PRO-123',
  title: '实现用户认证系统',
  description: `
# 用户认证系统实现

## 背景
需要为 Momentum 应用实现完整的用户认证系统，包括登录、注册、密码重置等功能。

## 需求
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 密码重置功能
- [ ] 邮箱验证功能
- [ ] 第三方登录集成（Google, GitHub）
- [ ] JWT token 管理
- [ ] 权限控制

## 技术栈
- React + TypeScript
- Node.js + Express
- PostgreSQL
- Redis (session 存储)
- JWT

## 验收标准
1. 用户能够成功注册和登录
2. 密码重置功能正常工作
3. 第三方登录集成完成
4. 权限控制正确实现
5. 通过所有测试用例
  `,
  status: 'In Progress',
  priority: 'Urgent',
  assignee: '张三',
  reporter: '李四',
  project: 'Momentum',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-16',
  labels: ['frontend', 'auth', 'high-priority'],
};

const mockComments = [
  {
    id: 'comment-1',
    author: '张三',
    content: '开始实现用户注册功能，预计今天完成基础表单验证。',
    createdAt: '2024-01-16 10:30',
  },
  {
    id: 'comment-2',
    author: '李四',
    content: '后端 API 已经准备好，可以开始前端集成。',
    createdAt: '2024-01-16 14:20',
  },
  {
    id: 'comment-3',
    author: '王五',
    content: '建议添加邮箱验证功能，提高安全性。',
    createdAt: '2024-01-16 16:45',
  },
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return <Flame className="h-4 w-4 text-red-500" />;
    case 'High':
      return <ArrowUp className="h-4 w-4 text-orange-500" />;
    case 'Medium':
      return <Minus className="h-4 w-4 text-blue-500" />;
    case 'Low':
      return <Minus className="h-4 w-4 text-gray-500" />;
    default:
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

export function IssueDetailSheet({
  open,
  onOpenChange,
  issueId,
}: IssueDetailSheetProps) {
  const [newComment, setNewComment] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/issues/${issueId}`
    );
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // 这里可以添加提交评论的逻辑
      console.log('提交评论:', newComment);
      setNewComment('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl font-bold">
                {mockIssueDetail.title}
              </SheetTitle>
              <SheetDescription className="mt-2">
                {mockIssueDetail.id} • 由 {mockIssueDetail.reporter} 创建
              </SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">描述</h3>
            <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {mockIssueDetail.description}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  负责人
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`/avatars/${mockIssueDetail.assignee}.png`}
                          />
                          <AvatarFallback className="text-xs">
                            {mockIssueDetail.assignee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {mockIssueDetail.assignee}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择负责人" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="张三">张三</SelectItem>
                        <SelectItem value="李四">李四</SelectItem>
                        <SelectItem value="王五">王五</SelectItem>
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  状态
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Badge variant="outline">{mockIssueDetail.status}</Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  优先级
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(mockIssueDetail.priority)}
                        <span className="text-sm">
                          {mockIssueDetail.priority}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  项目
                </span>
                <span className="text-sm">{mockIssueDetail.project}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  创建时间
                </span>
                <span className="text-sm">{mockIssueDetail.createdAt}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  更新时间
                </span>
                <span className="text-sm">{mockIssueDetail.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockIssueDetail.labels.map(label => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Comments */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              评论
            </h3>

            <div className="space-y-4 mb-4">
              {mockComments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/${comment.author}.png`} />
                    <AvatarFallback className="text-xs">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder="添加评论..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  发表评论
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
