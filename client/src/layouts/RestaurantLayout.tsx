// src/layouts/RestaurantLayout.tsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  ClipboardList, 
  User,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

export default function RestaurantLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/restaurant/dashboard' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/restaurant/menu' },
    { icon: ClipboardList, label: 'Orders', path: '/restaurant/orders' },
    { icon: User, label: 'Profile', path: '/restaurant/profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/restaurant/dashboard" className="text-xl font-bold">
            Nom Nom Now - Restaurant Portal
          </Link>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar navigation */}
          <nav className="w-64 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
