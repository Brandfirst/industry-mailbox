
import { ReactNode, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import AdminSidebar from "./AdminSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ChevronLeft, User, LogOut, Bell } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="flex items-center space-x-2 font-bold">
              <span>NewsletterHub</span>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Link 
                to="/" 
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                <span>Back to site</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user.user_metadata?.firstName || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/'}>
                      Home Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/account'}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0">
                      <LogoutHandler className="w-full flex items-center px-2 py-1.5 cursor-default" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main layout */}
      <div className="grid md:grid-cols-[240px_1fr]">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileSidebarOpen={isMobileSidebarOpen}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        
        <main className="flex min-h-screen flex-col container py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
