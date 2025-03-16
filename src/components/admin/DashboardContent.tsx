
import { Button } from "@/components/ui/button";
import { Inbox, PlusCircle, Users, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminStats from "@/components/AdminStats";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "@/lib/supabase/types";
import { format, formatDistanceToNow } from "date-fns";

interface DashboardContentProps {
  setActiveTab: (tab: string) => void;
  emailConnectionKey: string;
}

const DashboardContent = ({ setActiveTab, emailConnectionKey }: DashboardContentProps) => {
  const navigate = useNavigate();
  const [recentNewsletters, setRecentNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch recent newsletters
  useEffect(() => {
    const fetchRecentNewsletters = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*, categories:category_id(*)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error("Error fetching recent newsletters:", error);
        } else {
          setRecentNewsletters(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch newsletters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentNewsletters();
  }, []);

  // Format date for display
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

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
          {isLoading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between animate-pulse">
                <div className="w-full">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-muted rounded w-16 mt-1 sm:mt-0"></div>
              </div>
            ))
          ) : recentNewsletters.length > 0 ? (
            recentNewsletters.map(newsletter => (
              <div key={newsletter.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">{newsletter.title || "Untitled Newsletter"}</h3>
                  <div className="flex items-center flex-wrap text-sm text-muted-foreground">
                    <span>{newsletter.sender || "Unknown Sender"}</span>
                    {newsletter.categories && (
                      <>
                        <span className="mx-2 hidden sm:inline">•</span>
                        <span>{newsletter.categories.name || "Uncategorized"}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                  {formatDate(newsletter.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No newsletters found. Add some by connecting an email account.
            </div>
          )}
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
