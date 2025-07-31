/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface SidebarProviderProps {
  children: ReactNode;
  defaultLeftSidebarVisible?: boolean;
  defaultRightSidebarVisible?: boolean;
}

interface SidebarContextType {
  leftSidebarVisible: boolean;
  rightSidebarVisible: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebarVisible: (visible: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  showLeftSidebar: () => void;
  hideLeftSidebar: () => void;
  showRightSidebar: () => void;
  hideRightSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

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

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
