
import { useState, useEffect } from "react";
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
import { useOAuthCallbackHandler } from "./hooks/useOAuthCallbackHandler";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forceRerender, setForceRerender] = useState(0);
  
  // Use the extracted OAuth callback handler
  const { isOAuthCallback } = useOAuthCallbackHandler();
  
  // Update forceRerender when location changes
  useEffect(() => {
    console.log("[ADMIN PAGE] Admin location changed", { 
      pathname: location.pathname, 
      search: location.search,
      user: !!user,
      userId: user?.id,
      isOAuthCallback,
      timestamp: new Date().toISOString()
    });
    
    setForceRerender(prev => prev + 1);
  }, [location.pathname, location.search, user, isOAuthCallback]);
  
  // Handle tab changes based on URL
  useEffect(() => {
    // Only handle tab changes if we're not in the middle of an OAuth flow
    if (!isOAuthCallback) {
      const path = location.pathname.split('/');
      const tabFromPath = path.length > 2 ? path[2] : '';
      
      if (tabFromPath && ['dashboard', 'newsletters', 'categories', 'users', 'settings', 'newsletter-senders'].includes(tabFromPath)) {
        setActiveTab(tabFromPath);
      } else if (location.pathname === '/admin') {
        setActiveTab('dashboard');
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [location.pathname, navigate, isOAuthCallback]);
  
  // Update document title
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
  }, [activeTab]);
  
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

export default AdminPage;
