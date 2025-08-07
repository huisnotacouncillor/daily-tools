export interface SidebarContextType {
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
