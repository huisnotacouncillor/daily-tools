import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Focus,
  Frame,
  GalleryVerticalEnd,
  Inbox,
  Map,
  PieChart,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/layouts/root-layout/nav-main';
import { NavProjects } from '@/layouts/root-layout/nav-projects';
import { NavUser } from '@/layouts/root-layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@ui/sidebar';
import { ScrollArea } from '@ui/scroll-area';
import { NavTop } from './nav-top';
import { WorkspaceSwitcher } from './workspace-switcher';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navTop: [
    {
      name: 'Inbox',
      url: '/inbox',
      icon: Inbox,
    },
    {
      name: 'My Issues',
      url: '/my-issues',
      icon: Focus,
    },
    {
      name: 'Teams',
      url: '/teams',
      icon: BookOpen,
    },
  ],
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Workspace',
      url: '/workspace',
      icon: SquareTerminal,
      items: [
        {
          title: 'Projects',
          url: '/projects',
        },
        {
          title: 'Cycles',
          url: '/cycles',
        },
        {
          title: 'Roadmaps',
          url: '/roadmaps',
        },
      ],
    },
    {
      title: 'Your team',
      url: '/teams',
      icon: Bot,
      items: [
        {
          title: 'Team Members',
          url: '/teams/members',
        },
        {
          title: 'Team Settings',
          url: '/teams/settings',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '/projects/design-engineering',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '/projects/sales-marketing',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '/projects/travel',
      icon: Map,
    },
  ],
};

export const AppSidebar = React.memo(function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavTop items={data.navTop} />
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});
