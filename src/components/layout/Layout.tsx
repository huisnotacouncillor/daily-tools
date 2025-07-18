import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Code,
  SquareCode,
  FileJson,
  Palette,
  KeySquare,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigationItems = [
  {
    name: 'Regex Validator',
    path: '/regex',
    icon: SquareCode,
    description: 'Test and validate regular expressions',
  },
  {
    name: 'JSON Formatter',
    path: '/json',
    icon: FileJson,
    description: 'Format and validate JSON data',
  },
  {
    name: 'Color Converter',
    path: '/color',
    icon: Palette,
    description: 'Convert between color formats',
  },
  {
    name: 'JWT Decoder',
    path: '/jwt',
    icon: KeySquare,
    description: 'Decode and inspect JWT tokens',
  },
];

export function Layout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Header with top navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 lg:px-6 xl:px-8 justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight whitespace-nowrap">
                  Developer Tools
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                  Essential coding utilities
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex items-center space-x-2"
            aria-label="Main Navigation"
          >
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                    isActive
                      ? 'bg-accent text-primary  border-primary/20'
                      : 'hover:bg-accent hover:scale-[1.02]'
                  }`}
                >
                  <Icon
                    className={`mr-2 h-5 w-5 ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-accent-foreground'
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap ${
                      isActive ? 'text-primary' : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden ml-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Optional: Add theme toggle or other header actions here */}
        </div>
        {/* Mobile navigation dropdown */}
        {mobileNavOpen && (
          <nav
            id="mobile-nav-menu"
            className="md:hidden bg-background border-b px-4 py-2 shadow-sm animate-fade-in-down"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col space-y-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-accent hover:scale-[1.02]'
                    }`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon
                      className={`mr-2 h-5 w-5 ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-accent-foreground'
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap ${
                        isActive ? 'text-primary' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col w-full">
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 xl:py-12 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
