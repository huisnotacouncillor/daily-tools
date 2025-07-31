import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 模拟数据
const mockProjects = [
  {
    id: 'MOM-001',
    name: 'Momentum Launch',
    status: 'active',
    owner: '张三',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    progress: 75,
    description: 'Momentum 产品正式发布',
  },
  {
    id: 'MOM-002',
    name: 'Mobile App',
    status: 'planned',
    owner: '李四',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    progress: 0,
    description: '移动端应用开发',
  },
  {
    id: 'MOM-003',
    name: 'Enterprise Features',
    status: 'completed',
    owner: '王五',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    progress: 100,
    description: '企业级功能开发',
  },
  {
    id: 'MOM-004',
    name: 'AI Integration',
    status: 'planned',
    owner: '赵六',
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    progress: 0,
    description: 'AI 功能集成',
  },
];

const quarters = [
  { id: '2024-Q1', name: '2025 Q1', start: '2024-01-01', end: '2024-03-31' },
  { id: '2024-Q2', name: '2025 Q2', start: '2024-04-01', end: '2024-06-30' },
  { id: '2024-Q3', name: '2025 Q3', start: '2024-07-01', end: '2024-09-30' },
  { id: '2024-Q4', name: '2025 Q4', start: '2024-10-01', end: '2024-12-31' },
];

const statusColors = {
  completed: 'bg-success text-success-foreground',
  active: 'bg-primary text-primary-foreground',
  planned: 'bg-muted text-muted-foreground',
};

const getProjectPosition = (project: (typeof mockProjects)[0]) => {
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const timelineStart = new Date('2024-01-01');
  const timelineEnd = new Date('2024-12-31');

  const totalDays =
    (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
  const projectStart =
    (start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
  const projectDuration =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  const left = (projectStart / totalDays) * 100;
  const width = (projectDuration / totalDays) * 100;

  return { left: `${left}%`, width: `${width}%` };
};

export function Roadmaps() {
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('momentum.roadmaps.title')}</h1>
          <p className="text-muted-foreground">{t('momentum.roadmaps.subtitle')}</p>
        </div>

        {/* Timeline */}
        <div className="flex-1 bg-card rounded-lg border p-6">
          {/* Timeline Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {t('momentum.roadmaps.timelineTitle')}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>{t('momentum.roadmaps.completed')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>{t('momentum.roadmaps.active')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span>{t('momentum.roadmaps.planned')}</span>
                </div>
              </div>
            </div>

            {/* Quarter Labels */}
            <div className="flex border-b">
              {quarters.map(quarter => (
                <div
                  key={quarter.id}
                  className="flex-1 text-center py-2 text-sm font-medium text-muted-foreground border-r last:border-r-0"
                >
                  {quarter.name}
                </div>
              ))}
            </div>
          </div>

          {/* Projects Timeline */}
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {mockProjects.map(project => {
                const position = getProjectPosition(project);
                return (
                  <div key={project.id} className="relative h-12">
                    <div className="absolute left-0 top-0 w-48 pr-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/avatars/${project.owner}.png`} />
                          <AvatarFallback className="text-xs">
                            {project.owner.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm truncate">
                          {project.name}
                        </span>
                      </div>
                    </div>

                    <div className="ml-48 relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute top-2 h-8 rounded-md cursor-pointer transition-all hover:scale-105 ${
                              statusColors[
                                project.status as keyof typeof statusColors
                              ]
                            }`}
                            style={{
                              left: position.left,
                              width: position.width,
                            }}
                          >
                            <div className="h-full flex items-center justify-center text-xs font-medium px-2">
                              {project.name}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="w-64">
                          <div className="space-y-2">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.description}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{project.owner}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>{project.progress}%</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {project.startDate} - {project.endDate}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}
