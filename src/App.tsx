import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/providers';
import { RouteRenderer } from '@/components/routing/route-renderer';
import { publicRoutes, protectedRoutes } from '@/config/routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RouteRenderer
          publicRoutes={publicRoutes}
          protectedRoutes={protectedRoutes}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
