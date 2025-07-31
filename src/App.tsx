import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, SidebarProvider } from '@/providers';
import { ProtectedRoute } from '@/features/auth';
import { MomentumLayout } from '@/components/layout/MomentumLayout';

// 使用懒加载优化页面组件
const Login = lazy(() =>
  import('@/features/momentum/pages/Login').then(module => ({
    default: module.Login,
  }))
);
const TestAuth = lazy(() =>
  import('@/features/momentum/pages/TestAuth').then(module => ({
    default: module.TestAuth,
  }))
);
const Inbox = lazy(() =>
  import('@/features/momentum/pages/Inbox').then(module => ({
    default: module.Inbox,
  }))
);
const MyIssues = lazy(() =>
  import('@/features/momentum/pages/MyIssues').then(module => ({
    default: module.MyIssues,
  }))
);
const Cycles = lazy(() =>
  import('@/features/momentum/pages/Cycles').then(module => ({
    default: module.Cycles,
  }))
);
const Teams = lazy(() =>
  import('@/features/momentum/pages/Teams').then(module => ({
    default: module.Teams,
  }))
);
const Projects = lazy(() =>
  import('@/features/momentum/pages/Projects').then(module => ({
    default: module.Projects,
  }))
);
const Roadmaps = lazy(() =>
  import('@/features/momentum/pages/Roadmaps').then(module => ({
    default: module.Roadmaps,
  }))
);

// 加载中组件
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span>加载中...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <MomentumLayout />
                  </SidebarProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Inbox />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="my-issues" element={<MyIssues />} />
              <Route path="cycles" element={<Cycles />} />
              <Route path="teams" element={<Teams />} />
              <Route path="projects" element={<Projects />} />
              <Route path="roadmaps" element={<Roadmaps />} />
              <Route path="test-auth" element={<TestAuth />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
