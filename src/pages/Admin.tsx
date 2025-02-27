import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  Mail, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Layers,
  LayoutDashboard,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/components/AdminStats";

const Sidebar = ({ activeTab, setActiveTab }: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "newsletters", label: "Newsletters", icon: Mail },
    { id: "users", label: "Users", icon: Users },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-border p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8">
        <Mail className="w-6 h-6 text-primary" />
        <span className="text-lg font-medium">Admin Portal</span>
      </div>
      
      <nav className="space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id 
                ? "bg-primary text-white font-medium" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-8 left-0 w-full px-4">
        <Link to="/">
          <Button variant="outline" className="w-full justify-start mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Site
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    document.title = "Admin Dashboard | NewsletterHub";
  }, []);
  
  // Mock newsletter data for admin view
  const recentNewsletters = [
    { id: "1", title: "Startup Funding Trends Q3", sender: "VentureBeat", category: "Business", date: "2 hours ago" },
    { id: "2", title: "AI Weekly Roundup", sender: "TechCrunch", category: "Technology", date: "5 hours ago" },
    { id: "3", title: "Design Systems at Scale", sender: "UX Collective", category: "Design", date: "1 day ago" },
    { id: "4", title: "Healthcare Policy Updates", sender: "MedicalDaily", category: "Healthcare", date: "1 day ago" },
    { id: "5", title: "Crypto Market Analysis", sender: "CoinDesk", category: "Finance", date: "2 days ago" },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
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
            
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Recently Added Newsletters</h2>
                <Button variant="outline" size="sm" className="text-xs">
                  <Inbox className="mr-1 h-3 w-3" />
                  View All
                </Button>
              </div>
              
              <div className="divide-y">
                {recentNewsletters.map(newsletter => (
                  <div key={newsletter.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{newsletter.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{newsletter.sender}</span>
                        <span className="mx-2">•</span>
                        <span>{newsletter.category}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {newsletter.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium mb-4">Connect Email Account</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Gmail account to automatically fetch and archive newsletters.
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Connect Account
                </Button>
              </div>
              
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Newsletter Manually
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Invite New Admin
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="mr-2 h-4 w-4" />
                    Create New Category
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other tabs would be implemented similarly */}
        {activeTab !== "dashboard" && (
          <div className="bg-white rounded-lg border border-border p-8 text-center">
            <h2 className="text-xl font-medium mb-2">This Section is Under Construction</h2>
            <p className="text-muted-foreground mb-4">
              We're working on bringing you a complete admin experience.
            </p>
            <Button onClick={() => setActiveTab("dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
