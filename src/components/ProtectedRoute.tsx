
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
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Log auth status for debugging
  useEffect(() => {
    console.log('Protected Route Check:', { 
      requireAuth, 
      requireAdmin, 
      userExists: !!user, 
      isAdmin,
      pathname: location.pathname,
      isLoading,
      checkComplete,
      timeoutReached
    });
    
    // Mark check as complete after the first render
    if (!isLoading) {
      setCheckComplete(true);
    }
  }, [requireAuth, requireAdmin, user, isAdmin, location.pathname, isLoading, checkComplete, timeoutReached]);

  // Add a timeout to avoid getting stuck in loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Authentication check timed out - forcing continuation');
        setTimeoutReached(true);
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  // If still loading auth state and timeout not reached, show loading spinner
  if (isLoading && !timeoutReached) {
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
  if (requireAdmin && (checkComplete || timeoutReached) && !isAdmin) {
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
