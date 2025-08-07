import { useTranslation } from 'react-i18next';
import { Button } from '@ui/button';
import { ListFilter, SlidersHorizontal } from 'lucide-react';

export function TeamFilter() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b pl-7 pr-7">
      <div>
        <Button size="2xs" variant="outline">
          <ListFilter />
          {t('filter')}
        </Button>
      </div>
      <div>
        <Button size="2xs" variant="outline">
          <SlidersHorizontal />
          Display
        </Button>
      </div>
    </div>
  );
}
