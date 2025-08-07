import React, { useState, type ReactNode } from 'react';
import { SidebarContext } from '@/contexts';
import type { SidebarContextType } from '@/types';

interface SidebarProviderProps {
  children: ReactNode;
  defaultLeftSidebarVisible?: boolean;
  defaultRightSidebarVisible?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultLeftSidebarVisible = true,
  defaultRightSidebarVisible = true,
}) => {
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(
    defaultLeftSidebarVisible
  );
  const [rightSidebarVisible, setRightSidebarVisible] = useState(
    defaultRightSidebarVisible
  );

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible(prev => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarVisible(prev => !prev);
  };

  const showLeftSidebar = () => {
    setLeftSidebarVisible(true);
  };

  const hideLeftSidebar = () => {
    setLeftSidebarVisible(false);
  };

  const showRightSidebar = () => {
    setRightSidebarVisible(true);
  };

  const hideRightSidebar = () => {
    setRightSidebarVisible(false);
  };

  const value: SidebarContextType = {
    leftSidebarVisible,
    rightSidebarVisible,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarVisible,
    setRightSidebarVisible,
    showLeftSidebar,
    hideLeftSidebar,
    showRightSidebar,
    hideRightSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
