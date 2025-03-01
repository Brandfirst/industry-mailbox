
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getSenderStats } from "@/lib/supabase/newsletters/fetch";
import { CategoryWithStats, NewsletterCategory } from "@/lib/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import SenderList from "@/components/newsletter-senders/SenderList";
import { ArrowUpDown, RefreshCw, Search } from "lucide-react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { toast } from "sonner";
import { updateSenderCategory } from "@/lib/supabase/newsletters";

export default function NewsletterSenders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [senders, setSenders] = useState<NewsletterSenderStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "count" | "date">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        const senderStats = await getSenderStats(user.id);
        setSenders(senderStats);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load sender data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleRefresh = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      const refreshedStats = await getSenderStats(user.id);
      setSenders(refreshedStats);
      toast.success("Sender statistics refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh sender data");
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleCategoryChange = async (senderEmail: string, categoryId: number | null) => {
    if (!user) return;
    
    try {
      setUpdatingCategory(true);
      await updateSenderCategory(senderEmail, categoryId, user.id);
      
      // Update the category for this sender in the local state
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, category_id: categoryId }
            : sender
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
      throw error; // Re-throw to let the component handle the error message
    } finally {
      setUpdatingCategory(false);
    }
  };
  
  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  
  const filteredSenders = senders
    .filter(sender => {
      const senderName = sender.sender_name?.toLowerCase() || "";
      const senderEmail = sender.sender_email?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      return senderName.includes(term) || senderEmail.includes(term);
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortKey === "name") {
        const nameA = a.sender_name?.toLowerCase() || a.sender_email?.toLowerCase() || "";
        const nameB = b.sender_name?.toLowerCase() || b.sender_email?.toLowerCase() || "";
        comparison = nameA.localeCompare(nameB);
      } else if (sortKey === "count") {
        comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
      } else if (sortKey === "date") {
        const dateA = a.last_sync_date ? new Date(a.last_sync_date).getTime() : 0;
        const dateB = b.last_sync_date ? new Date(b.last_sync_date).getTime() : 0;
        comparison = dateA - dateB;
      }
      
      return sortAsc ? comparison : -comparison;
    });

  return (
    <Card className="border shadow-md max-w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">Newsletter Senders</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search senders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-row gap-2">
            <Button 
              variant={sortKey === "name" ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSort("name")}
            >
              Name {sortKey === "name" && <ArrowUpDown className="ml-1 h-4 w-4" />}
            </Button>
            <Button 
              variant={sortKey === "count" ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSort("count")}
            >
              Count {sortKey === "count" && <ArrowUpDown className="ml-1 h-4 w-4" />}
            </Button>
            <Button 
              variant={sortKey === "date" ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSort("date")}
            >
              Latest {sortKey === "date" && <ArrowUpDown className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <SenderList 
          senders={filteredSenders}
          categories={categories}
          loading={loading}
          onCategoryChange={handleCategoryChange}
        />
      </CardContent>
    </Card>
  );
}
