
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  Tags, 
  UserCircle, 
  Settings,
  ChevronRight,
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSidebarOpen?: boolean;
  toggleMobileSidebar?: () => void;
};

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab,
  isMobileSidebarOpen = false,
  toggleMobileSidebar = () => {}
}: AdminSidebarProps) => {
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Close mobile sidebar when a tab is clicked
    if (isMobileSidebarOpen) {
      toggleMobileSidebar();
    }
  };

  return (
    <aside className={cn(
      "bg-white min-h-screen w-64 border-r border-border shadow-sm fixed top-0 bottom-0 left-0 z-30 transition-transform duration-300 md:translate-x-0",
      isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileSidebar}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            Dashboard
          </div>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("dashboard")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
            {activeTab === "dashboard" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            Content
          </div>
          <NavLink
            to="/admin/newsletters"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("newsletters")}
          >
            <Mail className="h-5 w-5" />
            <span>Newsletters</span>
            {activeTab === "newsletters" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
          
          <NavLink
            to="/admin/newsletter-senders"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("newsletter-senders")}
          >
            <Users className="h-5 w-5" />
            <span>Newsletter Senders</span>
            {activeTab === "newsletter-senders" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
          
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("categories")}
          >
            <Tags className="h-5 w-5" />
            <span>Categories</span>
            {activeTab === "categories" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            Account
          </div>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("users")}
          >
            <UserCircle className="h-5 w-5" />
            <span>Users</span>
            {activeTab === "users" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
          
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => cn(
              "flex items-center space-x-3 rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleTabChange("settings")}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
            {activeTab === "settings" && (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
