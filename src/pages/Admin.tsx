
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  Mail, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Layers,
  LayoutDashboard,
  Inbox,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminStats from "@/components/AdminStats";
import EmailConnection from "@/components/EmailConnection";
import NewsletterSync from "@/components/NewsletterSync";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = ({ activeTab, setActiveTab, isMobileSidebarOpen, toggleMobileSidebar }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}) => {
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
              className="text-white hover:bg-white/10"
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

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { signOut, isAdmin, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [forceRerender, setForceRerender] = useState(0);
  const isMobile = useIsMobile();
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  
  // Check if the URL contains OAuth callback parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasOAuthParams = searchParams.has('code') || searchParams.has('error');
    setIsOAuthCallback(hasOAuthParams);
    
    if (hasOAuthParams) {
      console.log("Admin page detected OAuth callback parameters");
    }
  }, [location.search]);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  // Force rerender when returning to the admin page (important for OAuth flow)
  useEffect(() => {
    console.log("Admin location changed", { 
      pathname: location.pathname, 
      search: location.search,
      user: !!user,
      session: !!session,
      isOAuthCallback
    });
    
    // This will trigger a rerender whenever the location changes
    setForceRerender(prev => prev + 1);
  }, [location.pathname, location.search, user, session, isOAuthCallback]);
  
  // Set active tab based on URL path
  useEffect(() => {
    // Extract the tab from the URL path, e.g., /admin/newsletters -> newsletters
    const path = location.pathname.split('/');
    const tabFromPath = path.length > 2 ? path[2] : '';
    
    if (tabFromPath && ['dashboard', 'newsletters', 'categories', 'users', 'settings'].includes(tabFromPath)) {
      setActiveTab(tabFromPath);
    } else if (location.pathname === '/admin') {
      // Default to dashboard if just /admin
      setActiveTab('dashboard');
      // Update URL to include the tab
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  useEffect(() => {
    document.title = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Admin Dashboard`;
    
    // Check for Google OAuth callback
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state === 'gmail_connect') {
      console.log('Found OAuth callback parameters in Admin page URL');
      // The EmailConnection component will handle this
      
      // If we don't have a user but have a saved session token, try to use it
      if (!user) {
        const savedUserId = sessionStorage.getItem('auth_user_id');
        if (savedUserId) {
          console.log("Found saved user ID during OAuth callback:", savedUserId);
        }
      }
    }
    
    // Clean up any OAuth flags if user refreshes admin page without completing OAuth
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    if (oauthInProgress === 'true' && !location.search.includes('code=') && !location.search.includes('error=')) {
      console.log('Detected refresh during OAuth flow, resetting state');
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  }, [location, user, activeTab]);
  
  // Handle auth permission check separately from regular checks to avoid redirect during OAuth callback
  useEffect(() => {
    // Skip auth check if we're in the middle of an OAuth callback
    if (isOAuthCallback) {
      console.log("Skipping auth check during OAuth callback");
      return;
    }
    
    // If we notice we're not an admin at any point, redirect to home
    if (isAdmin === false) {
      console.log("Not an admin, redirecting to home");
      toast.error("You don't have permission to access the admin area");
      navigate('/');
    }
    
    // Make sure user is authenticated
    if (!user && !isAdmin && !isOAuthCallback) {
      console.log("No user and not in OAuth flow, redirecting to auth");
      navigate('/auth?mode=signin');
    }
  }, [user, isAdmin, navigate, isOAuthCallback]);
  
  // Mock newsletter data for admin view
  const recentNewsletters = [
    { id: "1", title: "Startup Funding Trends Q3", sender: "VentureBeat", category: "Business", date: "2 hours ago" },
    { id: "2", title: "AI Weekly Roundup", sender: "TechCrunch", category: "Technology", date: "5 hours ago" },
    { id: "3", title: "Design Systems at Scale", sender: "UX Collective", category: "Design", date: "1 day ago" },
    { id: "4", title: "Healthcare Policy Updates", sender: "MedicalDaily", category: "Healthcare", date: "1 day ago" },
    { id: "5", title: "Crypto Market Analysis", sender: "CoinDesk", category: "Finance", date: "2 days ago" },
  ];
  
  const handleLogout = async () => {
    await signOut();
  };
  
  // Force re-render of EmailConnection component with a key that changes
  // whenever the location or forceRerender state changes
  const emailConnectionKey = `email-connection-${user?.id || 'no-user'}-${forceRerender}-${isOAuthCallback ? 'oauth' : 'regular'}`;
  
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
      
      {renderMobileMenuButton()}
      
      <div className={`${isMobile ? 'ml-0 px-4 pt-16' : 'ml-64 p-8'}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "newsletters" && "Newsletters"}
            {activeTab === "users" && "Users"}
            {activeTab === "categories" && "Categories"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === "dashboard" && "Overview of your NewsletterHub instance"}
            {activeTab === "newsletters" && "Manage all archived newsletters"}
            {activeTab === "users" && "View and manage user accounts"}
            {activeTab === "categories" && "Configure industry categories"}
            {activeTab === "settings" && "Admin account and system settings"}
          </p>
        </div>
        
        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <AdminStats />
            
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-card-foreground">Recently Added Newsletters</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={() => {
                    setActiveTab("newsletters");
                    navigate('/admin/newsletters');
                  }}
                >
                  <Inbox className="mr-1 h-3 w-3" />
                  View All
                </Button>
              </div>
              
              <div className="divide-y divide-border">
                {recentNewsletters.map(newsletter => (
                  <div key={newsletter.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-medium text-card-foreground">{newsletter.title}</h3>
                      <div className="flex items-center flex-wrap text-sm text-muted-foreground">
                        <span>{newsletter.sender}</span>
                        <span className="mx-2 hidden sm:inline">•</span>
                        <span>{newsletter.category}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                      {newsletter.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Using refactored EmailConnection component with key to force re-render */}
              <div key={emailConnectionKey}>
                <EmailConnection />
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                <h2 className="text-lg font-medium mb-4 text-card-foreground">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Newsletter Manually
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Invite New Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-foreground"
                    onClick={() => {
                      setActiveTab("categories");
                      navigate('/admin/categories');
                    }}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Create New Category
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Newsletters Tab Content */}
        {activeTab === "newsletters" && (
          <div className="space-y-6">
            <NewsletterSync />
          </div>
        )}
        
        {/* Other tabs (categories, users, settings) would be implemented similarly */}
        {(activeTab === "categories" || activeTab === "users" || activeTab === "settings") && (
          <div className="bg-card rounded-lg border border-border p-6 text-center my-4">
            <h2 className="text-xl font-medium mb-2 text-card-foreground">This Section is Under Construction</h2>
            <p className="text-muted-foreground mb-4">
              We're working on bringing you a complete admin experience.
            </p>
            <Button onClick={() => {
              setActiveTab("dashboard");
              navigate('/admin/dashboard');
            }}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
