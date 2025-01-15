// src/layouts/AdminLayout.tsx
import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Users,
  Store,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronDown,
  AlertCircle,
  Bell,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Navigation items for the admin panel
  const navigationItems = [
    {
      section: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      path: '/admin/dashboard',
    },
    {
      section: 'users',
      label: 'User Management',
      icon: Users,
      path: '/admin/users',
    },
    {
      section: 'restaurants',
      label: 'Restaurants',
      icon: Store,
      subItems: [
        {
          label: 'All Restaurants',
          path: '/admin/restaurants',
        },
        {
          label: 'Pending Approvals',
          path: '/admin/restaurants/pending',
        },
        {
          label: 'Reports',
          path: '/admin/restaurants/reports',
        },
      ],
    },
    {
      section: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
    },
    {
      section: 'settings',
      label: 'System Settings',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link to="/admin/dashboard" className="text-xl font-bold">
              Nom Nom Now Admin
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:block">
                {user?.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 bottom-0 z-40 w-64 border-r bg-white transition-transform lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <nav className="space-y-1 p-4">
            {navigationItems.map((item) => (
              <div key={item.section} className="space-y-1">
                {item.subItems ? (
                  // Dropdown for items with subitems
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => setActiveSection(
                        activeSection === item.section ? '' : item.section
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.label}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          activeSection === item.section && "rotate-180"
                        )}
                      />
                    </Button>
                    {activeSection === item.section && (
                      <div className="pl-10 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem.path}
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => navigate(subItem.path)}
                          >
                            {subItem.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      setActiveSection(item.section);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-200",
            isSidebarOpen ? "lg:ml-64" : ""
          )}
        >
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
