// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireVerified?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireVerified = false 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    switch (user.role) {
      case 'CUSTOMER':
        return <Navigate to="/" replace />;
      case 'RESTAURANT_OWNER':
        return <Navigate to="/restaurant/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Check verification status for restaurant owners if required
  if (
    requireVerified && 
    user.role === 'RESTAURANT_OWNER' && 
    user.verificationStatus !== 'VERIFIED'
  ) {
    return <Navigate to="/restaurant/pending-verification" replace />;
  }

  return <>{children}</>;
}

// Example usage in routes:
/*
// Customer routes
<Route 
  path="/profile" 
  element={
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <CustomerProfile />
    </ProtectedRoute>
  } 
/>

// Restaurant owner routes
<Route 
  path="/restaurant/dashboard" 
  element={
    <ProtectedRoute 
      allowedRoles={['RESTAURANT_OWNER']} 
      requireVerified={true}
    >
      <RestaurantDashboard />
    </ProtectedRoute>
  } 
/>

// Admin routes
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout />
    </ProtectedRoute>
  } 
/>
*/
