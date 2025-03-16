
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { getSenderStats } from "@/lib/supabase/newsletters/analytics";
import { getSenderFrequencyData } from "@/lib/supabase/newsletters/frequency-analytics";
import { CategoryWithStats, NewsletterCategory } from "@/lib/supabase/types";
import { NewsletterSenderStats, SenderFrequencyAnalytics } from "@/lib/supabase/newsletters/types";
import { toast } from "sonner";
import { updateSenderCategory, updateSenderBrand } from "@/lib/supabase/newsletters";

// Define a type mapping function to convert between the API and component types
function mapToSenderFrequencyData(data: SenderFrequencyAnalytics[]): SenderFrequencyData[] {
  return data.map(item => ({
    date: item.date,
    sender: item.sender,
    count: item.count
  }));
}

export type SenderFrequencyData = {
  date: string;
  sender: string;
  count: number;
};

export function useNewsletterSenders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [senders, setSenders] = useState<NewsletterSenderStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "count" | "date">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [updatingBrand, setUpdatingBrand] = useState(false);
  const [frequencyData, setFrequencyData] = useState<SenderFrequencyData[] | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setLoadingAnalytics(true);
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        const senderStats = await getSenderStats(user.id);
        setSenders(senderStats);
        
        const frequencyData = await getSenderFrequencyData(user.id, 30);
        setFrequencyData(mapToSenderFrequencyData(frequencyData));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load sender data");
      } finally {
        setLoading(false);
        setLoadingAnalytics(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleRefresh = useCallback(async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      setLoadingAnalytics(true);
      
      const refreshedStats = await getSenderStats(user.id);
      setSenders(refreshedStats);
      
      const freshFrequencyData = await getSenderFrequencyData(user.id, 30);
      setFrequencyData(mapToSenderFrequencyData(freshFrequencyData));
      
      toast.success("Sender statistics refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh sender data");
    } finally {
      setRefreshing(false);
      setLoadingAnalytics(false);
    }
  }, [user]);
  
  const handleCategoryChange = useCallback(async (senderEmail: string, categoryId: number | null) => {
    if (!user) return;
    
    try {
      setUpdatingCategory(true);
      await updateSenderCategory(senderEmail, categoryId, user.id);
      
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, category_id: categoryId }
            : sender
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    } finally {
      setUpdatingCategory(false);
    }
  }, [user]);
  
  const handleBrandChange = useCallback(async (senderEmail: string, brandName: string) => {
    if (!user) return;
    
    try {
      setUpdatingBrand(true);
      await updateSenderBrand(senderEmail, brandName, user.id);
      
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail
            ? { ...sender, brand_name: brandName }
            : sender
        )
      );
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    } finally {
      setUpdatingBrand(false);
    }
  }, [user]);

  const handleDeleteSenders = useCallback(async (senderEmails: string[]) => {
    if (!user || senderEmails.length === 0) return;
    
    try {
      setDeleting(true);
      
      // Delete all newsletters from these senders
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .in('sender_email', senderEmails);
      
      if (error) throw error;
      
      // Update the local state
      setSenders(prevSenders => 
        prevSenders.filter(sender => !senderEmails.includes(sender.sender_email))
      );
      
    } catch (error) {
      console.error("Error deleting senders:", error);
      throw error;
    } finally {
      setDeleting(false);
    }
  }, [user]);
  
  const toggleSort = useCallback((key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey, sortAsc]);
  
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

  return {
    senders,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    sortKey,
    sortAsc,
    refreshing,
    updatingCategory,
    updatingBrand,
    deleting,
    frequencyData,
    loadingAnalytics,
    handleRefresh,
    handleCategoryChange,
    handleBrandChange,
    handleDeleteSenders,
    toggleSort,
    filteredSenders
  };
}
