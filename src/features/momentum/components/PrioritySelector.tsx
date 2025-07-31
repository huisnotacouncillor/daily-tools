import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { priorityOptions } from './constants/index';

interface PrioritySelectorProps {
  priority: any;
  onChange: (priority: any) => void;
  disabled?: boolean;
  options?: {
    value: any;
    label: string;
    icon: React.ReactNode;
  }[];
}

export function PrioritySelector({
  priority,
  onChange,
  disabled = false,
  options = priorityOptions,
}: PrioritySelectorProps) {
  const { t } = useTranslation();

  const currentPriority = options.find(option => option.value === priority);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1 py-1 transition-colors"
        disabled={disabled}
        title={t(`priority.${priority}`)}
      >
        {currentPriority?.icon}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-32">
        {options.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2"
          >
            {option.icon}
            <span>{t(`priority.${option.value}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
