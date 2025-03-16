
import { useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { getSenderStats } from "@/lib/supabase/newsletters/analytics";
import { getSenderFrequencyData } from "@/lib/supabase/newsletters/frequency-analytics";
import { toast } from "sonner";
import { SenderFrequencyData } from "./types";

// Helper function to map API data to component format
function mapToSenderFrequencyData(data: any[]): SenderFrequencyData[] {
  return data.map(item => ({
    date: item.date,
    sender: item.sender,
    count: item.count
  }));
}

export function useRefreshSenders(
  setRefreshing: (value: boolean) => void,
  setLoadingAnalytics: (value: boolean) => void,
  setSenders: React.Dispatch<React.SetStateAction<any[]>>,
  setFrequencyData: React.Dispatch<React.SetStateAction<SenderFrequencyData[] | null>>
) {
  const { user } = useAuth();

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
  }, [user, setRefreshing, setLoadingAnalytics, setSenders, setFrequencyData]);

  return { handleRefresh };
}
