
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterCategory } from "@/lib/supabase/types";
import { getSenderStats } from "@/lib/supabase/newsletters/analytics";
import { getSenderFrequencyData } from "@/lib/supabase/newsletters/frequency-analytics";
import { toast } from "sonner";
import { SenderFrequencyData } from "./types";

// Define a type mapping function to convert between the API and component types
function mapToSenderFrequencyData(data: any[]): SenderFrequencyData[] {
  return data.map(item => ({
    date: item.date,
    sender: item.sender,
    count: item.count
  }));
}

export function useSenderData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [senders, setSenders] = useState([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [frequencyData, setFrequencyData] = useState<SenderFrequencyData[] | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

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

  return {
    senders,
    setSenders,
    categories,
    loading,
    frequencyData,
    setFrequencyData,
    loadingAnalytics,
    setLoadingAnalytics
  };
}
