
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
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Set a timeout to ensure the loading state doesn't get stuck
  useEffect(() => {
    // Only set a timeout if we're loading
    if (isLoading && !hasTimedOut) {
      const timer = setTimeout(() => {
        console.warn('Auth check timeout reached');
        setHasTimedOut(true);
      }, 2000); // Shorter timeout of 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasTimedOut]);

  // Log current auth state
  useEffect(() => {
    console.log('Protected Route Check:', { 
      requireAuth,
      requireAdmin, 
      userExists: !!user, 
      isAdmin,
      pathname: location.pathname,
      isLoading,
      hasTimedOut
    });
  }, [requireAuth, requireAdmin, user, isAdmin, location.pathname, isLoading, hasTimedOut]);

  // Show loading state only if still loading and timeout not reached
  if (isLoading && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen p-5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Route protection logic
  if (requireAuth && !user) {
    // User is not logged in but route requires auth
    return <Navigate to={`/auth?mode=signin&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // User is not an admin but route requires admin
    toast.error("You don't have permission to access this area");
    return <Navigate to="/search" replace />;
  }

  if (!requireAuth && user) {
    // User is logged in but route is only for non-authenticated users
    return <Navigate to="/search" replace />;
  }

  // All checks passed, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
