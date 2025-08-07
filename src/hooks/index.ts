// Auth hooks
export { useAuth } from './use-auth';
export { useTheme } from './use-theme';
export { useIsMobile } from './use-mobile';
export { useSidebar } from './use-sidebar';

import { useLocation } from 'react-router-dom';

/**
 * Hook to check if current route matches a given path
 * @param path - The path to match against
 * @param exact - Whether to match exactly or include sub-routes
 * @returns boolean indicating if the route matches
 */
export const useRouteMatch = (path: string, exact: boolean = false) => {
  const location = useLocation();

  if (exact) {
    return location.pathname === path;
  }

  return location.pathname.startsWith(path);
};
