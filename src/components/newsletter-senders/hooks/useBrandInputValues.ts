
import { useState, useEffect, useCallback } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";

export function useBrandInputValues(senders: NewsletterSenderStats[]) {
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});
  
  // Initialize brand input values from senders
  useEffect(() => {
    const brandValues: Record<string, string> = {};
    senders.forEach(sender => {
      brandValues[sender.sender_email] = sender.brand_name || "";
    });
    setBrandInputValues(prevValues => ({
      ...prevValues,
      ...brandValues
    }));
  }, [senders]);

  // Get brand input value helper
  const getBrandInputValue = useCallback((sender: NewsletterSenderStats) => {
    // First check our local state
    if (brandInputValues[sender.sender_email] !== undefined) {
      return brandInputValues[sender.sender_email];
    }
    // Fall back to the value from the sender object
    return sender.brand_name || "";
  }, [brandInputValues]);

  // Update brand input value helper - this ensures we update both our local state
  // and provide an updated value back to the component
  const updateBrandInputValue = useCallback((senderEmail: string, brandName: string) => {
    setBrandInputValues(prevValues => ({
      ...prevValues,
      [senderEmail]: brandName
    }));
  }, []);

  return { 
    brandInputValues, 
    setBrandInputValues,
    getBrandInputValue,
    updateBrandInputValue
  };
}
