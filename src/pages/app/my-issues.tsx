import { PageLayout } from '@/layouts/page-layout';
import {
  IssueHeader,
  IssueList,
  IssueFilter,
  IssuePanel,
} from '@/features/workspace/my-issues';
import type { Issue } from '@/types';
import type { IssuePriority, IssueStatus } from '@/types/enum';
import { initialIssues } from '@/mock/my-issue';
import { useState } from 'react';

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
    <PageLayout
      header={headerContent}
      sidebar={sidebarContent}
      enableSidebarToggle={true}
    >
      {mainContent}
    </PageLayout>
  );
}
