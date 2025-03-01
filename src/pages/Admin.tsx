
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardContent from "@/components/admin/DashboardContent";
import UnderConstructionTab from "@/components/admin/UnderConstructionTab";
import NewsletterSync from "@/components/NewsletterSync";
import { DebugEdgeFunction } from "@/components/DebugEdgeFunction";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut, isAdmin, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forceRerender, setForceRerender] = useState(0);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasOAuthParams = searchParams.has('code') || searchParams.has('error');
    setIsOAuthCallback(hasOAuthParams);
    
    if (hasOAuthParams) {
      console.log("[ADMIN PAGE] Detected OAuth callback parameters:", {
        hasCode: searchParams.has('code'),
        hasError: searchParams.has('error'),
        state: searchParams.get('state')
      });
    }
  }, [location.search]);
  
  useEffect(() => {
    console.log("[ADMIN PAGE] Admin location changed", { 
      pathname: location.pathname, 
      search: location.search,
      user: !!user,
      session: !!session,
      isOAuthCallback
    });
    
    setForceRerender(prev => prev + 1);
  }, [location.pathname, location.search, user, session, isOAuthCallback]);
  
  useEffect(() => {
    const path = location.pathname.split('/');
    const tabFromPath = path.length > 2 ? path[2] : '';
    
    if (tabFromPath && ['dashboard', 'newsletters', 'categories', 'users', 'settings'].includes(tabFromPath)) {
      setActiveTab(tabFromPath);
    } else if (location.pathname === '/admin') {
      setActiveTab('dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
    
    // Process OAuth parameters if present
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state === 'gmail_connect') {
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
    if (oauthInProgress === 'true' && !location.search.includes('code=') && !location.search.includes('error=')) {
      console.log('[ADMIN PAGE] Detected refresh during OAuth flow, resetting state');
      toast.error("OAuth flow interrupted. Please try connecting again.");
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  }, [location, user, activeTab]);
  
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
      
      {(activeTab === "categories" || activeTab === "users" || activeTab === "settings") && (
        <UnderConstructionTab setActiveTab={setActiveTab} />
      )}
    </AdminLayout>
  );
};

export default Admin;
