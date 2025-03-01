
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Mail, Users, Tags, UserCircle, Settings } from "lucide-react";

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

  const AdminSidebarLink = ({ label, icon, isActive, onClick }) => (
    <NavLink
      to={`/admin/${label.toLowerCase().replace(' ', '-')}`}
      className={({ isActive }) => cn(
        "flex items-center space-x-2 rounded-md p-2 hover:bg-secondary",
        isActive ? "bg-secondary text-foreground font-medium" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={cn(
      "bg-card min-h-screen w-64 border-r shadow-sm fixed top-0 bottom-0 left-0 z-30 transition-transform duration-300 md:translate-x-0",
      isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <AdminSidebarLink 
                label="Dashboard" 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                isActive={activeTab === "dashboard"} 
                onClick={() => handleTabChange("dashboard")} 
              />
            </li>
            <li>
              <AdminSidebarLink 
                label="Newsletters" 
                icon={<Mail className="h-5 w-5" />} 
                isActive={activeTab === "newsletters"} 
                onClick={() => handleTabChange("newsletters")} 
              />
            </li>
            <li>
              <AdminSidebarLink 
                label="Newsletter Senders" 
                icon={<Users className="h-5 w-5" />} 
                isActive={activeTab === "newsletter-senders"} 
                onClick={() => handleTabChange("newsletter-senders")} 
              />
            </li>
            <li>
              <AdminSidebarLink 
                label="Categories" 
                icon={<Tags className="h-5 w-5" />} 
                isActive={activeTab === "categories"} 
                onClick={() => handleTabChange("categories")} 
              />
            </li>
            <li>
              <AdminSidebarLink 
                label="Users" 
                icon={<UserCircle className="h-5 w-5" />} 
                isActive={activeTab === "users"} 
                onClick={() => handleTabChange("users")} 
              />
            </li>
            <li>
              <AdminSidebarLink 
                label="Settings" 
                icon={<Settings className="h-5 w-5" />} 
                isActive={activeTab === "settings"} 
                onClick={() => handleTabChange("settings")} 
              />
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
