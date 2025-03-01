import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardContent from "@/components/admin/DashboardContent";
import NewsletterSync from "@/components/NewsletterSync";
import { DebugEdgeFunction } from "@/components/DebugEdgeFunction";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import NewsletterSenders from "@/pages/NewsletterSenders";
import UsersPage from "@/pages/admin/UsersPage";
import UnderConstructionTab from "@/components/admin/UnderConstructionTab";

const Admin = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "dashboard");
  
  useEffect(() => {
    if (!tab) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setActiveTab(tab);
    }
  }, [tab, navigate]);
  
  useEffect(() => {
    const validTabs = ["dashboard", "newsletters", "categories", "users", "settings", "newsletter-senders"];
    if (tab && !validTabs.includes(tab)) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [tab, navigate]);

  // Update document title
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
  }, [activeTab]);
  
  // Create a unique key for the components
  const componentKey = `${activeTab}-${Date.now()}`;
  
  // Create a unique key for email connection component
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
};

export default Admin;
