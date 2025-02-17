// src/components/header.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  ShoppingBag,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = isAuthenticated
    ? [
        { name: "Menu", path: "/menu" },
        { name: "Orders", path: "/order" },
        { name: "Reservations", path: "/reservation" },
        { name: "Contact", path: "/contact" },
      ]
    : [
        { name: "Menu", path: "/menu" },
        { name: "Contact", path: "/contact" },
      ];

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/" : "/home"}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF4500] to-[#FF8A0D] bg-clip-text text-transparent">
              Nom Nom Now
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-[#FF4500]"
                    : "text-gray-600 hover:text-[#FF4500]"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4500]"
                    animate
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hover:bg-gray-100 rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/checkout')}
                  className="hover:bg-gray-100 rounded-full relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#FF4500] rounded-full text-[10px] text-white flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>

                {/* Profile Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF4500] to-[#FF8A0D]"
                      >
                        <span className="text-sm font-medium text-white">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    {/* User Info Section */}
                    <div className="flex items-center gap-3 p-2">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FF8A0D] flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {user?.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator />
                    
                    {/* Main Menu Items */}
                    <div className="p-1">
                      <DropdownMenuItem 
                        onClick={handleProfileClick}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => navigate('/settings')}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>

                      {user?.role === 'RESTAURANT_OWNER' && (
                        <DropdownMenuItem 
                          onClick={() => navigate('/restaurant/dashboard')}
                          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Restaurant Dashboard</span>
                        </DropdownMenuItem>
                      )}
                    </div>

                    <DropdownMenuSeparator />
                    
                    {/* Logout Button */}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 mt-1 cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Separate Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-[#FF4500] hover:bg-[#FF4500]/90"
                  onClick={() => navigate("/login")}
                >
                  Order Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}