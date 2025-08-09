import { useState } from 'react';
import type { Label } from '@/types';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LabelForm } from './label-form';

interface LabelItemProps {
  label: Label;
  onEdit?: (id: string, data: Label) => void;
  onDelete?: (id: string) => void;
}

export const LabelItem = ({ label, onEdit, onDelete }: LabelItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { i18n } = useTranslation();

  // 格式化创建时间为月-年格式
  const formatCreatedAt = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      const isChineseLocale = i18n.language === 'zh';

      if (isChineseLocale) {
        // 中文格式：2025-08
        return format(date, 'yyyy-MM', { locale: zhCN });
      } else {
        // 英文格式：Aug 2025
        return format(date, 'MMM yyyy', { locale: enUS });
      }
    } catch (error) {
      return dateString; // 如果格式化失败，返回原始字符串
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = (data: Label) => {
    if (onEdit && label.id) {
      onEdit(label.id, data);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && label.id) {
      onDelete(label.id);
    }
  };

  if (isEditing) {
    return (
      <LabelForm
        initialData={label}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <div className="flex items-center px-14 hover:bg-accent group">
      <div className="flex-auto flex items-center gap-2 px-3 py-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: label.color }}
        ></div>
        <div className="text-sm">{label.name}</div>
      </div>
      <div className="min-w-40 max-w-60 px-3 py-2">{label?.usage || null}</div>
      <div className="min-w-40 max-w-40 px-3 py-2">
        {formatCreatedAt(label.created_at)}
      </div>
      <div className="w-8 px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
