import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Braces, Palette, Key, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
    description: "Back to homepage"  
  },
  {
    name: "Regex Validator",
    path: "/regex",
    icon: Code,
    description: "Test and validate regular expressions",
  },
  {
    name: "JSON Formatter",
    path: "/json",
    icon: Braces,
    description: "Format and validate JSON data",
  },
  {
    name: "Color Converter",
    path: "/color",
    icon: Palette,
    description: "Convert between color formats",
  },
  {
    name: "JWT Decoder",
    path: "/jwt",
    icon: Key,
    description: "Decode and inspect JWT tokens",
  },
];

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 lg:px-6 xl:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
            aria-label={
              sidebarOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <Link to="/" className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Developer Tools
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Essential coding utilities
                </span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            {/* Optional: Add theme toggle or other header actions here */}
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 items-start lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-12 px-4 lg:px-6 xl:px-8">
        {/* Sidebar */}
        <aside
          id="mobile-sidebar"
          className={`fixed top-16 z-30 h-[calc(100vh-4rem)] w-80 max-w-[80vw] bg-background border-r lg:border-r-0 transition-transform duration-200 ease-in-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full py-6 px-4 lg:px-0 lg:pr-6 overflow-y-auto">
            <nav
              className="space-y-2"
              aria-label="Main Navigation"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-accent hover:scale-[1.02]"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                    }`} />
                    <div className="flex flex-col">
                      <span className={isActive ? "text-primary" : ""}>{item.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main
          id="main-content"
          className="flex w-full flex-col min-h-[calc(100vh-4rem)]"
        >
          <div className="py-4 sm:py-6 lg:py-8 xl:py-12 flex-1 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-16 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
