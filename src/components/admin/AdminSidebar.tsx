
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Mail, 
  Users, 
  Settings, 
  LogOut, 
  Layers,
  LayoutDashboard,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isMobileSidebarOpen, 
  toggleMobileSidebar 
}: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "newsletters", label: "Newsletters", icon: Mail },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  // Only render if sidebar is open on mobile, always render on desktop
  if (isMobile && !isMobileSidebarOpen) {
    return null;
  }

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-40' : 'h-screen w-64 fixed left-0 top-0'}`}>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar content */}
      <div className={`
        ${isMobile ? 'w-[240px] h-screen z-50 absolute' : 'w-64 h-screen'} 
        bg-sidebar left-0 top-0 border-r border-border
      `}>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium text-white">Admin Portal</span>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileSidebar}
              className="text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <nav className="space-y-1 px-3 py-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(`/admin/${tab.id}`);
                if (isMobile) toggleMobileSidebar();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id 
                  ? "bg-primary text-white font-medium" 
                  : "text-gray-300 hover:bg-secondary hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-8 left-0 w-full px-4">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start mb-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
