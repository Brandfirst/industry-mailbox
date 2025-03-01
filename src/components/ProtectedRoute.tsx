
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
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
  const [loggedOnce, setLoggedOnce] = useState(false);

  // Set a timeout to ensure the loading state doesn't get stuck
  useEffect(() => {
    // Only set a timeout if we're loading
    if (isLoading && !hasTimedOut) {
      const timer = setTimeout(() => {
        console.warn('Auth check timeout reached - forcing completion');
        setHasTimedOut(true);
      }, 1500); // Short timeout of 1.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasTimedOut]);

  // Log current auth state - but only once
  useEffect(() => {
    if (!loggedOnce) {
      console.log('Protected Route Check:', { 
        requireAuth,
        requireAdmin, 
        userExists: !!user, 
        isAdmin,
        pathname: location.pathname,
        isLoading,
        hasTimedOut
      });
      setLoggedOnce(true);
    }
  }, [requireAuth, requireAdmin, user, isAdmin, location.pathname, isLoading, hasTimedOut, loggedOnce]);

  // Show loading state only if still loading and timeout not reached
  if (isLoading && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen p-5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we're still loading but timeout has been reached, make a decision based on what we know
  // This prevents getting stuck in the loading state
  if (isLoading && hasTimedOut) {
    console.log('Auth check timed out, proceeding with available information:', { 
      userExists: !!user, 
      isAdmin: !!isAdmin,
      requireAuth,
      requireAdmin
    });
    
    // If we require auth but don't have a user, redirect to login
    if (requireAuth && !user) {
      return <Navigate to={`/auth?mode=signin&redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }
    
    // If we require admin but don't have admin, redirect to search
    if (requireAdmin && !isAdmin) {
      toast.error("You don't have permission to access this area");
      return <Navigate to="/search" replace />;
    }
    
    // If this is a non-auth route but we have a user, redirect to search
    if (!requireAuth && user) {
      return <Navigate to="/search" replace />;
    }
    
    // In other cases, proceed with rendering the children
  }

  // Regular route protection logic (when not loading)
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
