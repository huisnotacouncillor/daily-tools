import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/providers';
import { PanelRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function IssueHeader() {
  const { t } = useTranslation();
  const { toggleRightSidebar, rightSidebarVisible } = useSidebar();

  return (
    <div className="flex items-center justify-between pl-8 pr-7 border-b h-10 shrink-0">
      <div className="flex items-center gap-2">
        <span>{t('myissues.title')}</span>
        <Button variant="outline" size="2xs">
          Assigned
        </Button>
        <Button variant="outline" size="2xs">
          Created
        </Button>
        <Button variant="outline" size="2xs">
          Subscribed
        </Button>
        <Button variant="outline" size="2xs">
          Active
        </Button>
      </div>
      <div>
        <Toggle
          variant="ghost"
          size="xs"
          onClick={toggleRightSidebar}
          pressed={rightSidebarVisible}
        >
          <PanelRight className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
}
