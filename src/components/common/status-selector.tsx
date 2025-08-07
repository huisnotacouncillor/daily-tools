import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { IssueStatus } from '@/types/enum';
import { Circle, CircleCheck, CircleDashed, CircleX } from 'lucide-react';

interface StatusSelectorProps {
  status: any;
  options?: any[];
  onChange: (status: any) => void;
  disabled?: boolean;
  showLabel?: boolean;
  localePrefix?: string;
}

const statusOptions: {
  value: IssueStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: IssueStatus.Backlog,
    label: 'Backlog',
    icon: <CircleDashed className="text-gray-500" />,
  },
  {
    value: IssueStatus.Todo,
    label: 'Todo',
    icon: <Circle className="text-gray-500" />,
  },
  {
    value: IssueStatus.InProgress,
    label: 'In Progress',
    icon: <Circle className="text-yellow-500" />,
  },
  {
    value: IssueStatus.InReview,
    label: 'In Review',
    icon: <Circle className="text-blue-500" />,
  },
  {
    value: IssueStatus.Done,
    label: 'Done',
    icon: <CircleCheck className="text-green-500" />,
  },
  {
    value: IssueStatus.Canceled,
    label: 'Canceled',
    icon: <CircleX className="text-gray" />,
  },
];

export function StatusSelector({
  status,
  onChange,
  options = statusOptions,
  disabled = false,
  showLabel = false,
  localePrefix = 'status',
}: StatusSelectorProps) {
  const { t } = useTranslation();
  const currentStatus = options.find(option => option.value === status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={t(`${localePrefix}.${status}`)}
        disabled={disabled}
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 py-1 transition-colors"
      >
        {currentStatus?.icon}
        {showLabel && <span>{t(`${localePrefix}.${status}`)}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-32">
        {options.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2"
          >
            {option.icon}
            <span>{t(`${localePrefix}.${option.value}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
