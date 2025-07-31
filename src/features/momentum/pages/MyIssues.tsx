import { PageLayout } from '@/components/layout/PageLayout';
import { IssueHeader } from '../components/my-issues/IssueHeader';
import { IssueList } from '../components/my-issues/IssueList';
import type { Issue } from '@/types';
import type { IssuePriority, IssueStatus } from '@/types/enum';
import { initialIssues } from '@/mock/my-issue';
import { useState } from 'react';
import { IssueFilter } from '../components/my-issues/IssueFilter';
import { IssuePanel } from '../components/my-issues/IssuePanel';
import { SidebarProvider } from '@/providers';

export function MyIssues() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handlePriorityChange = (issueId: string, priority: IssuePriority) => {
    setIssues(prev =>
      prev.map(issue => (issue.id === issueId ? { ...issue, priority } : issue))
    );
  };

  const handleStatusChange = (issueId: string, status: IssueStatus) => {
    setIssues(prev =>
      prev.map(issue => (issue.id === issueId ? { ...issue, status } : issue))
    );
  };

  const handleRowClick = (issueId: string) => {
    setSelectedRow(issueId);
  };

  const headerContent = (
    <>
      <IssueHeader />
      <IssueFilter />
    </>
  );

  const sidebarContent = <IssuePanel />;

  const mainContent = (
    <IssueList
      issues={issues}
      selectedRow={selectedRow}
      onRowClick={handleRowClick}
      onPriorityChange={handlePriorityChange}
      onStatusChange={handleStatusChange}
    />
  );

  return (
    <SidebarProvider>
      <PageLayout
        header={headerContent}
        sidebar={sidebarContent}
        enableSidebarToggle={true}
      >
        {mainContent}
      </PageLayout>
    </SidebarProvider>
  );
}
