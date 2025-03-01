import { Button } from "@/components/ui/button";
import { Inbox, PlusCircle, Users, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminStats from "@/components/AdminStats";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface DashboardContentProps {
  setActiveTab: (tab: string) => void;
  emailConnectionKey: string;
}

const DashboardContent = ({ setActiveTab, emailConnectionKey }: DashboardContentProps) => {
  const navigate = useNavigate();
  
  // Mock newsletter data for admin view
  const recentNewsletters = [
    { id: "1", title: "Startup Funding Trends Q3", sender: "VentureBeat", category: "Business", date: "2 hours ago" },
    { id: "2", title: "AI Weekly Roundup", sender: "TechCrunch", category: "Technology", date: "5 hours ago" },
    { id: "3", title: "Design Systems at Scale", sender: "UX Collective", category: "Design", date: "1 day ago" },
    { id: "4", title: "Healthcare Policy Updates", sender: "MedicalDaily", category: "Healthcare", date: "1 day ago" },
    { id: "5", title: "Crypto Market Analysis", sender: "CoinDesk", category: "Finance", date: "2 days ago" },
  ];

  // Import the EmailConnection component
  // We need to use dynamic import to avoid circular dependency issues
  const [EmailConnection, setEmailConnection] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const importEmailConnection = async () => {
      const module = await import('@/components/EmailConnection');
      setEmailConnection(() => module.default);
    };
    importEmailConnection();
  }, []);

  return (
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
          {EmailConnection && <EmailConnection />}
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
  );
};

export default DashboardContent;
