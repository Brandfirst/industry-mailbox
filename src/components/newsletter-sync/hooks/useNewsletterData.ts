
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  EmailAccount, 
  NewsletterCategory, 
  Newsletter,
  getUserEmailAccounts, 
  getAllCategories
} from "@/lib/supabase";

// This hook handles loading the initial data (accounts and categories)
export function useNewsletterData(userId: string | undefined) {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load email accounts and categories
  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      
      try {
        setErrorMessage(null);
        const accounts = await getUserEmailAccounts(userId);
        setEmailAccounts(accounts);
        
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
        }
        
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setErrorMessage("Failed to load email accounts or categories.");
        toast.error("Failed to load data");
      }
    };
    
    loadData();
  }, [userId]);

  return {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    categories,
    errorMessage,
    setErrorMessage
  };
}
