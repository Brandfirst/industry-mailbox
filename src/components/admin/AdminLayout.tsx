
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout = ({ children, activeTab, setActiveTab }: AdminLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Only show mobile menu button on mobile
  const renderMobileMenuButton = () => {
    if (!isMobile) return null;
    
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileSidebar}
        className="lg:hidden text-white absolute left-4 top-4 z-20"
      >
        <Menu className="h-6 w-6" />
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      
      {renderMobileMenuButton()}
      
      <div className={`${isMobile ? 'ml-0 px-4 pt-16' : 'ml-64 p-8'}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
