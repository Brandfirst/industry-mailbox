import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardContent from "@/components/admin/DashboardContent";
import UnderConstructionTab from "@/components/admin/UnderConstructionTab";
import NewsletterSync from "@/components/NewsletterSync";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut, isAdmin, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forceRerender, setForceRerender] = useState(0);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  
  // Check if the URL contains OAuth callback parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasOAuthParams = searchParams.has('code') || searchParams.has('error');
    setIsOAuthCallback(hasOAuthParams);
    
    if (hasOAuthParams) {
      console.log("Admin page detected OAuth callback parameters");
    }
  }, [location.search]);
  
  // Force rerender when returning to the admin page (important for OAuth flow)
  useEffect(() => {
    console.log("Admin location changed", { 
      pathname: location.pathname, 
      search: location.search,
      user: !!user,
      session: !!session,
      isOAuthCallback
    });
    
    // This will trigger a rerender whenever the location changes
    setForceRerender(prev => prev + 1);
  }, [location.pathname, location.search, user, session, isOAuthCallback]);
  
  // Set active tab based on URL path
  useEffect(() => {
    // Extract the tab from the URL path, e.g., /admin/newsletters -> newsletters
    const path = location.pathname.split('/');
    const tabFromPath = path.length > 2 ? path[2] : '';
    
    if (tabFromPath && ['dashboard', 'newsletters', 'categories', 'users', 'settings'].includes(tabFromPath)) {
      setActiveTab(tabFromPath);
    } else if (location.pathname === '/admin') {
      // Default to dashboard if just /admin
      setActiveTab('dashboard');
      // Update URL to include the tab
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
    
    // Check for Google OAuth callback
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state === 'gmail_connect') {
      console.log('Found OAuth callback parameters in Admin page URL');
      // The EmailConnection component will handle this
      
      // If we don't have a user but have a saved session token, try to use it
      if (!user) {
        const savedUserId = sessionStorage.getItem('auth_user_id');
        if (savedUserId) {
          console.log("Found saved user ID during OAuth callback:", savedUserId);
        }
      }
    }
    
    // Clean up any OAuth flags if user refreshes admin page without completing OAuth
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    if (oauthInProgress === 'true' && !location.search.includes('code=') && !location.search.includes('error=')) {
      console.log('Detected refresh during OAuth flow, resetting state');
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  }, [location, user, activeTab]);
  
  // Handle auth permission check separately from regular checks to avoid redirect during OAuth callback
  useEffect(() => {
    // Skip auth check if we're in the middle of an OAuth callback
    if (isOAuthCallback) {
      console.log("Skipping auth check during OAuth callback");
      return;
    }
    
    // If we notice we're not an admin at any point, redirect to home
    if (isAdmin === false) {
      console.log("Not an admin, redirecting to home");
      toast.error("You don't have permission to access the admin area");
      navigate('/');
    }
    
    // Make sure user is authenticated
    if (!user && !isAdmin && !isOAuthCallback) {
      console.log("No user and not in OAuth flow, redirecting to auth");
      navigate('/auth?mode=signin');
    }
  }, [user, isAdmin, navigate, isOAuthCallback]);
  
  // Force re-render of EmailConnection component with a key that changes
  // whenever the location or forceRerender state changes
  const emailConnectionKey = `email-connection-${user?.id || 'no-user'}-${forceRerender}-${isOAuthCallback ? 'oauth' : 'regular'}`;
  
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AdminHeader activeTab={activeTab} />
      
      {/* Dashboard Content */}
      {activeTab === "dashboard" && (
        <DashboardContent 
          setActiveTab={setActiveTab}
          emailConnectionKey={emailConnectionKey}
        />
      )}
      
      {/* Newsletters Tab Content */}
      {activeTab === "newsletters" && (
        <div className="space-y-6">
          <NewsletterSync />
        </div>
      )}
      
      {/* Other tabs (categories, users, settings) would be implemented similarly */}
      {(activeTab === "categories" || activeTab === "users" || activeTab === "settings") && (
        <UnderConstructionTab setActiveTab={setActiveTab} />
      )}
    </AdminLayout>
  );
};

export default Admin;
