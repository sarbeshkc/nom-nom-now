import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Search, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthService from '@/services/auth.service';

export default function Navbar() {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Nom Nom Now
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {user?.name}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}