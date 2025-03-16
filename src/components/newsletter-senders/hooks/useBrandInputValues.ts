
import { useState, useEffect } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";

export function useBrandInputValues(senders: NewsletterSenderStats[]) {
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});
  
  // Initialize brand input values from senders
  useEffect(() => {
    const brandValues: Record<string, string> = {};
    senders.forEach(sender => {
      brandValues[sender.sender_email] = sender.brand_name || "";
    });
    setBrandInputValues(brandValues);
  }, [senders]);

  // Get brand input value helper
  const getBrandInputValue = (sender: NewsletterSenderStats) => {
    // First check our local state
    if (brandInputValues[sender.sender_email] !== undefined) {
      return brandInputValues[sender.sender_email];
    }
    // Fall back to the value from the sender object
    return sender.brand_name || "";
  };

  return { 
    brandInputValues, 
    setBrandInputValues,
    getBrandInputValue
  };
}
