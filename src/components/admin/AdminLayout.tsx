
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
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout = ({ children, activeTab, setActiveTab }: AdminLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin } = useAuth();
  const { theme } = useTheme();
  
  // Update admin theme but preserve user's light/dark preference
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
    <div className={`min-h-screen bg-background ${theme} text-foreground admin-layout`}>
      <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-dark-200/80'} backdrop-blur-sm border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} sticky top-0 z-50 w-full admin-header`}>
        <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className={`flex items-center ${theme === 'light' ? 'text-gray-800 hover:text-[#FF5722]' : 'text-white hover:text-[#FF5722]'} transition-colors`}>
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back to site</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle 
              variant="ghost"
              className={`${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-dark-400 hover:bg-dark-500'} border-[#FF5722]/30`} 
            />
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-dark-400 hover:bg-dark-500'}`}>
                    <User className={`w-5 h-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`${theme === 'light' ? 'bg-white' : 'bg-dark-300'} ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                  <DropdownMenuLabel className={theme === 'light' ? 'text-gray-900' : 'text-gray-100'}>
                    {user.user_metadata?.firstName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} />
                  <DropdownMenuItem onClick={() => window.location.href = '/'} className={`${theme === 'light' ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-dark-400 text-gray-200'}`}>
                    Home Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/account'} className={`${theme === 'light' ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-dark-400 text-gray-200'}`}>
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} />
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
      
      <div className={`${isMobile ? 'ml-0 px-4 pt-16' : 'ml-64 p-8'} ${theme === 'light' ? 'text-gray-900 bg-gray-100' : 'text-white bg-dark-200'} min-h-screen`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
