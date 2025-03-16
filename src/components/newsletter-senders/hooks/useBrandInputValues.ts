
import { useState, useEffect, useCallback } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";

export function useBrandInputValues(senders: NewsletterSenderStats[]) {
  const [brandInputValues, setBrandInputValues] = useState<Record<string, string>>({});
  
  // Initialize brand input values from senders whenever senders change
  useEffect(() => {
    const brandValues: Record<string, string> = {};
    senders.forEach(sender => {
      // Only update if the value is different or not set yet
      if (brandInputValues[sender.sender_email] === undefined || 
          brandInputValues[sender.sender_email] !== sender.brand_name) {
        brandValues[sender.sender_email] = sender.brand_name || "";
      }
    });
    
    if (Object.keys(brandValues).length > 0) {
      setBrandInputValues(prevValues => ({
        ...prevValues,
        ...brandValues
      }));
      console.log("Updated brand input values from senders:", brandValues);
    }
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

  // Update brand input value helper
  const updateBrandInputValue = useCallback((senderEmail: string, brandName: string) => {
    console.log(`Updating brand input value for ${senderEmail} to "${brandName}"`);
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
