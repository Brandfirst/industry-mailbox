
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardContent from "@/components/admin/DashboardContent";
import NewsletterSync from "@/components/NewsletterSync";
import { DebugEdgeFunction } from "@/components/DebugEdgeFunction";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import NewsletterSenders from "@/pages/NewsletterSenders";
import UsersPage from "@/pages/admin/UsersPage";
import UnderConstructionTab from "@/components/admin/UnderConstructionTab";
import NewsletterAutomaticSync from "@/pages/admin/NewsletterAutomaticSync";

const Admin = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(tab || "dashboard");
  
  const isOAuthCallback = searchParams.has('code') && searchParams.has('state');
  
  useEffect(() => {
    console.log("[ADMIN] URL parameters:", {
      tab,
      hasCode: searchParams.has('code'),
      hasState: searchParams.has('state'),
      state: searchParams.get('state'),
      isOAuthCallback,
      fullUrl: window.location.href
    });
    
    if (isOAuthCallback) {
      console.log("[ADMIN] OAuth callback detected, ensuring we're on dashboard tab");
      setActiveTab("dashboard");
    } 
    else if (!tab) {
      navigate("/admin/dashboard", { replace: true });
    } 
    else {
      setActiveTab(tab);
    }
  }, [tab, navigate, searchParams, isOAuthCallback]);
  
  useEffect(() => {
    const validTabs = ["dashboard", "newsletters", "categories", "users", "settings", "newsletter-senders", "automatic-sync"];
    if (tab && !validTabs.includes(tab) && !isOAuthCallback) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [tab, navigate, isOAuthCallback]);

  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
  }, [activeTab]);
  
  const componentKey = `${activeTab}-${Date.now()}`;
  
  const emailConnectionKey = `email-connection-${Date.now()}`;
  
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AdminHeader activeTab={activeTab} />
      
      {activeTab === "dashboard" && (
        <>
          <DashboardContent 
            setActiveTab={setActiveTab}
            key={componentKey}
            emailConnectionKey={emailConnectionKey}
          />
          <DebugEdgeFunction />
        </>
      )}
      
      {activeTab === "newsletters" && (
        <div className="space-y-6">
          <NewsletterSync key={componentKey} />
        </div>
      )}
      
      {activeTab === "automatic-sync" && (
        <div className="space-y-6">
          <NewsletterAutomaticSync key={componentKey} />
        </div>
      )}
      
      {activeTab === "newsletter-senders" && (
        <div className="space-y-6">
          <NewsletterSenders key={componentKey} />
        </div>
      )}
      
      {activeTab === "categories" && (
        <div className="space-y-6">
          <CategoriesManagement key={componentKey} />
        </div>
      )}
      
      {activeTab === "users" && (
        <div className="space-y-6">
          <UsersPage key={componentKey} />
        </div>
      )}
      
      {activeTab === "settings" && (
        <UnderConstructionTab setActiveTab={setActiveTab} key={componentKey} />
      )}
    </AdminLayout>
  );
}

export default Admin;
