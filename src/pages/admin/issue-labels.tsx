import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Label } from '@/types';
import { LabelItem } from '@/features/admin/label/label-item';
import { LabelForm } from '@/features/admin/label/label-form';
import { labelAPI } from '@/services';
import { useEffect, useState } from 'react';
import { LabelLevel } from '@/types/enum';

export const Labels = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [showNewLabel, setShowNewLabel] = useState(false);
  const [filterName, setFilterName] = useState('');

  const getLabelList = async () => {
    const res = await labelAPI.getLabels({
      level: LabelLevel.Issue,
      name: filterName,
    });
    setLabels(res.data || []);
  };

  const onHandleFilterName = async () => {
    await getLabelList();
  };

  const handleCreateLabel = async (data: Label) => {
    try {
      const res = await labelAPI.createLabel({
        ...data,
        level: LabelLevel.Issue,
      });
      if (res.data) {
        setLabels(prev => [res.data!, ...prev]);
        setShowNewLabel(false);
      }
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  };

  const handleCancelCreate = () => {
    setShowNewLabel(false);
  };

  const handleEditLabel = async (id: string, data: Label) => {
    try {
      console.log('handleEditLabel', id, data);
      const res = await labelAPI.updateLabel(id, data);
      if (res.data) {
        setLabels(prev =>
          prev.map(label => (label.id === id ? { ...label, ...data } : label))
        );
      }
    } catch (error) {
      console.error('Failed to update label:', error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await labelAPI.deleteLabel(id);
      setLabels(prev => prev.filter(label => label.id !== id));
    } catch (error) {
      console.error('Failed to delete label:', error);
    }
  };

  useEffect(() => {
    getLabelList();
    document.title = 'Issue labels';
  }, []);

  return (
    <section className="flex flex-col w-full gap-2 h-full overflow-hidden">
      <header className="text-lg font-bold px-14 pt-16">Issue Labels</header>
      <main className="flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-between px-14">
          <div>
            <Input
              placeholder="Filter by name..."
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              onBlur={onHandleFilterName}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onHandleFilterName();
                }
              }}
            />
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => setShowNewLabel(true)}
              disabled={showNewLabel}
            >
              New Label
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center px-14 border-b">
            <div className="flex-auto px-3 py-2"> Name</div>
            <div className="min-w-40 max-w-60 px-3 py-2"> Usage</div>
            <div className="min-w-40 max-w-40 px-3 py-2"> Created</div>
            <div className="w-8 px-3 py-2"></div>
          </div>
          {showNewLabel && (
            <LabelForm
              onSave={handleCreateLabel}
              onCancel={handleCancelCreate}
            />
          )}
          <ScrollArea className="h-[calc(100vh-216px)]">
            {labels.map(label => (
              <LabelItem
                key={label.id}
                label={label}
                onEdit={handleEditLabel}
                onDelete={handleDeleteLabel}
              />
            ))}
          </ScrollArea>
        </div>
      </main>
    </section>
  );
};
