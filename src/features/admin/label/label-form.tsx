import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils';
import type { Label } from '@/types/label';
import { LabelLevel } from '@/types/enum';

// Predefined color options for labels
const LABEL_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Purple
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Lavender
  '#85C1E9', // Sky Blue
  '#F8C471', // Orange
  '#82E0AA', // Light Green
];

interface LabelFormProps {
  initialData?: Label; // 如果提供了初始数据，则为编辑模式
  onSave: (data: Label) => void;
  onCancel: () => void;
}

export const LabelForm = ({
  initialData,
  onSave,
  onCancel,
}: LabelFormProps) => {
  const isEditMode = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color || LABEL_COLORS[0]
  );
  const [customColor, setCustomColor] = useState('');
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  // 重置表单到初始状态
  const resetForm = () => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setSelectedColor(initialData.color);
    } else {
      setName('');
      setSelectedColor(LABEL_COLORS[0]);
    }
    setCustomColor('');
    setColorPopoverOpen(false);
  };

  // 当初始数据变化时重置表单
  useEffect(() => {
    resetForm();
  }, [initialData]);

  const handleSave = () => {
    if (name.trim()) {
      const labelData: Label = {
        ...initialData,
        name: name.trim(),
        color: selectedColor,
        level: initialData?.level || LabelLevel.Issue,
      };
      onSave(labelData);

      // 只有在新建模式下才重置表单
      if (!isEditMode) {
        resetForm();
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor('');
    setColorPopoverOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    // 验证是否是有效的颜色格式
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      setSelectedColor(color);
    }
  };

  const handleCustomColorSubmit = () => {
    if (customColor && /^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      setSelectedColor(customColor);
      setColorPopoverOpen(false);
    }
  };

  return (
    <div className="flex items-center px-14 bg-muted/50 border-b">
      <div className="flex-auto flex items-center px-3">
        {/* Color Preview and Picker */}
        <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-600 transition-colors duration-200 cursor-pointer p-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              {/* Predefined Colors */}
              <div>
                <h4 className="text-sm font-medium mb-2">预设颜色</h4>
                <div className="grid grid-cols-6 gap-2">
                  {LABEL_COLORS.map(color => (
                    <div
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        'w-4 h-4 rounded-full border-2 cursor-pointer border-transparent hover:scale-110 transition-all duration-200',
                        selectedColor === color &&
                          'border-foreground ring-2 ring-foreground ring-offset-2'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <h4 className="text-sm font-medium mb-2">自定义颜色</h4>
                <div className="flex gap-2">
                  <Input
                    value={customColor}
                    onChange={e => handleCustomColorChange(e.target.value)}
                    placeholder="#FF6B6B"
                    className="flex-1 text-sm h-7"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleCustomColorSubmit();
                      }
                    }}
                  />
                  <Button
                    size="xs"
                    onClick={handleCustomColorSubmit}
                    disabled={
                      !customColor || !/^#[0-9A-Fa-f]{6}$/.test(customColor)
                    }
                  >
                    应用
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  请输入 6 位十六进制颜色代码 (如: #FF6B6B)
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Label Name Input */}
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Label name"
          className="flex-auto max-w-48 border-0 shadow-none focus-visible:ring-0"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          autoFocus
        />
      </div>

      {/* Placeholder columns to match table layout */}
      <div className="min-w-40 max-w-60 px-3 py-2"></div>

      {/* Action Buttons */}
      <div className="w-fit px-3 py-2 flex gap-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={!name.trim()}
          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
