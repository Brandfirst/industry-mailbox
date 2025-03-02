
import { ReactNode, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import AdminSidebar from "./AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ChevronLeft, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutHandler } from "@/components/navbar/LogoutHandler";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout = ({ children, activeTab, setActiveTab }: AdminLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin } = useAuth();
  
  // Add admin-theme class to root when component mounts
  useEffect(() => {
    document.documentElement.classList.add('admin-theme');
    
    // Clean up when unmounting
    return () => {
      document.documentElement.classList.remove('admin-theme');
    };
  }, []);
  
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
    <div className="min-h-screen bg-background dark text-foreground admin-layout">
      <div className="bg-dark-200/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 w-full admin-header">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center text-white hover:text-[#FF5722] transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back to site</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-dark-400 hover:bg-dark-500">
                    <User className="w-5 h-5 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-dark-300 border-white/10">
                  <DropdownMenuLabel className="text-gray-100">
                    {user.user_metadata?.firstName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => window.location.href = '/'} className="hover:bg-dark-400 text-gray-200">
                    Home Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/account'} className="hover:bg-dark-400 text-gray-200">
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="p-0">
                    <LogoutHandler className="w-full flex items-center px-2 py-1.5 cursor-default" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      
      {renderMobileMenuButton()}
      
      <div className={`${isMobile ? 'ml-0 px-4 pt-16' : 'ml-64 p-8'} text-white bg-dark-200 min-h-screen`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
