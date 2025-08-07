import { Route, Routes } from 'react-router-dom';
import { memo } from 'react';
import type { RouteConfig } from '@/types/routing';
import { ProtectedRoute } from '@/features/auth';
import { RootLayout } from '@/layouts/root-layout';
import { SidebarProvider } from '@/providers';

interface RouteRendererProps {
  publicRoutes: RouteConfig[];
  protectedRoutes: RouteConfig[];
}

export const RouteRenderer = memo<RouteRendererProps>(
  ({ publicRoutes, protectedRoutes }) => {
    return (
      <Routes>
        {/* 公开路由 */}
        {publicRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}

        {/* 受保护的路由 - 只在父级包装ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarProvider>
                <RootLayout />
              </SidebarProvider>
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Route>
      </Routes>
    );
  }
);
