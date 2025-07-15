import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Braces, Palette, Key, Menu, X } from "lucide-react";
import { useState } from "react";

const tools = [
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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-sidebar"
            aria-label={
              sidebarOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Code className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Developer Tools
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <h1 className="text-lg font-semibold md:hidden">
                Developer Tools
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside
          id="mobile-sidebar"
          className={`fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block ${
            sidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav
              className="grid items-start gap-2"
              aria-label="Main Navigation"
            >
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = location.pathname === tool.path;

                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{tool.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main
          id="main-content"
          className="flex w-full flex-col overflow-hidden"
        >
          <div className="py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-14 z-20 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
