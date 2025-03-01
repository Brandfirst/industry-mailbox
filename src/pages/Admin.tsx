import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardContent from "@/components/admin/DashboardContent";
import UnderConstructionTab from "@/components/admin/UnderConstructionTab";
import NewsletterSync from "@/components/NewsletterSync";
import { DebugEdgeFunction } from "@/components/DebugEdgeFunction";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import NewsletterSenders from "@/pages/NewsletterSenders";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut, isAdmin, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forceRerender, setForceRerender] = useState(0);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  
  // Detect OAuth callback parameters in the URL and set appropriate state
  const checkForOAuthParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    const hasOAuthParams = !!code || !!error;
    const isGmailCallback = state === 'gmail_connect';
    
    console.log("[ADMIN PAGE] Checking for OAuth params:", { 
      hasCode: !!code, 
      codeLength: code ? code.length : 0,
      state,
      hasError: !!error,
      error,
      isGmailCallback,
      pathname: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString()
    });
    
    // Only set isOAuthCallback state to true if it's actually a Gmail OAuth callback
    // This ensures we don't mishandle other code/error parameters
    setIsOAuthCallback(hasOAuthParams && isGmailCallback);
    
    if (hasOAuthParams) {
      // Log more details about the OAuth parameters
      console.log("[ADMIN PAGE] Detected OAuth parameters:", {
        hasCode: !!code,
        codeLength: code ? code.length : 0,
        state,
        hasError: !!error,
        error,
        search: location.search,
        oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
        savedUserId: sessionStorage.getItem('auth_user_id'),
        currentUser: user?.id,
        timestamp: new Date().toISOString()
      });
      
      // If there's an error in the URL, show it to the user
      if (error) {
        toast.error(`OAuth error: ${error}`);
      }
    }
    
    return hasOAuthParams && isGmailCallback;
  }, [location.search, user?.id]);
  
  useEffect(() => {
    checkForOAuthParams();
  }, [checkForOAuthParams]);
  
  useEffect(() => {
    console.log("[ADMIN PAGE] Admin location changed", { 
      pathname: location.pathname, 
      search: location.search,
      user: !!user,
      userId: user?.id,
      session: !!session,
      isOAuthCallback,
      timestamp: new Date().toISOString()
    });
    
    setForceRerender(prev => prev + 1);
  }, [location.pathname, location.search, user, session, isOAuthCallback]);
  
  // Handle tab changes based on URL
  useEffect(() => {
    // Only handle tab changes if we're not in the middle of an OAuth flow
    if (!isOAuthCallback) {
      const path = location.pathname.split('/');
      const tabFromPath = path.length > 2 ? path[2] : '';
      
      if (tabFromPath && ['dashboard', 'newsletters', 'categories', 'users', 'settings'].includes(tabFromPath)) {
        setActiveTab(tabFromPath);
      } else if (location.pathname === '/admin') {
        setActiveTab('dashboard');
        // Only navigate if we're not handling an OAuth callback
        if (!checkForOAuthParams()) {
          navigate('/admin/dashboard', { replace: true });
        }
      }
    }
  }, [location.pathname, navigate, isOAuthCallback, checkForOAuthParams]);
  
  // Update document title and handle OAuth flow
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
    
    // Process OAuth parameters if present
    if (checkForOAuthParams()) {
      console.log('[ADMIN PAGE] Found OAuth callback parameters in Admin page URL');
      if (!user) {
        const savedUserId = sessionStorage.getItem('auth_user_id');
        if (savedUserId) {
          console.log("[ADMIN PAGE] Found saved user ID during OAuth callback:", savedUserId);
        }
      }
    }
    
    // Handle OAuth flow interruption (e.g., page refresh during flow)
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    const startTime = sessionStorage.getItem('oauth_start_time');
    const timeElapsed = startTime ? `${((Date.now() - parseInt(startTime)) / 1000).toFixed(1)}s` : 'unknown';
    
    // Only clear OAuth state if we're not in the middle of a callback
    if (oauthInProgress === 'true' && !location.search.includes('code=') && !location.search.includes('error=')) {
      console.log('[ADMIN PAGE] Detected refresh during OAuth flow, resetting state', { timeElapsed });
      
      // Only show toast if it's been more than 5 seconds since OAuth start
      if (!startTime || Date.now() - parseInt(startTime) > 5000) {
        toast.error("OAuth flow interrupted. Please try connecting again.");
      }
      
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
    }
  }, [location, user, activeTab, checkForOAuthParams]);
  
  // Protect admin routes
  useEffect(() => {
    if (isOAuthCallback) {
      console.log("[ADMIN PAGE] Skipping auth check during OAuth callback");
      return;
    }
    
    if (isAdmin === false) {
      console.log("[ADMIN PAGE] Not an admin, redirecting to home");
      toast.error("You don't have permission to access the admin area");
      navigate('/');
    }
    
    if (!user && !isAdmin && !isOAuthCallback) {
      console.log("[ADMIN PAGE] No user and not in OAuth flow, redirecting to auth");
      navigate('/auth?mode=signin');
    }
  }, [user, isAdmin, navigate, isOAuthCallback]);
  
  // Create a unique key for the EmailConnection component
  // This helps ensure it re-renders properly when the OAuth state changes
  const emailConnectionKey = `email-connection-${user?.id || 'no-user'}-${forceRerender}-${isOAuthCallback ? 'oauth' : 'regular'}`;
  
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AdminHeader activeTab={activeTab} />
      
      {activeTab === "dashboard" && (
        <>
          <DashboardContent 
            setActiveTab={setActiveTab}
            emailConnectionKey={emailConnectionKey}
          />
          <DebugEdgeFunction />
        </>
      )}
      
      {activeTab === "newsletters" && (
        <div className="space-y-6">
          <NewsletterSync />
        </div>
      )}
      
      {activeTab === "newsletter-senders" && (
        <div className="space-y-6">
          <NewsletterSenders />
        </div>
      )}
      
      {activeTab === "categories" && (
        <div className="space-y-6">
          <CategoriesManagement />
        </div>
      )}
      
      {(activeTab === "users" || activeTab === "settings") && (
        <UnderConstructionTab setActiveTab={setActiveTab} />
      )}
    </AdminLayout>
  );
};

export default Admin;
