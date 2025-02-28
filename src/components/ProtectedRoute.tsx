
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requireAdmin = false
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  const [checkComplete, setCheckComplete] = useState(false);

  // Log auth status for debugging
  useEffect(() => {
    console.log('Protected Route Check:', { 
      requireAuth, 
      requireAdmin, 
      userExists: !!user, 
      isAdmin,
      pathname: location.pathname
    });
    
    // Mark check as complete after the first render
    if (!isLoading) {
      setCheckComplete(true);
    }
  }, [requireAuth, requireAdmin, user, isAdmin, location.pathname, isLoading]);

  // If still loading auth state, show a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-primary font-medium">Checking authentication...</p>
      </div>
    );
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to={`/auth?mode=signin&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If admin access is required, check for admin role
  if (requireAdmin && checkComplete && !isAdmin) {
    console.log('Admin access denied:', { user, isAdmin });
    toast.error("You don't have permission to access the admin area");
    return <Navigate to="/search" replace />;
  }

  // If we have a user but this is a route that should only be accessible when logged out
  if (!requireAuth && user) {
    return <Navigate to="/search" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
