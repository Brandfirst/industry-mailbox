
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Newsletter {
  id: number;
  title: string;
  sender: string;
  industry: string;
  preview: string;
  content: string;
  published_at: string;
  created_at: string;
  categories?: any;
}

export interface EmailAccount {
  id: string;
  user_id: string;
  email: string;
  provider: string;
  is_connected: boolean;
  access_token: string;
  refresh_token: string | null;
  created_at: string | null;
  last_sync: string | null;
}

// Simple interface to avoid deep type instantiation
export interface NewsletterFilters {
  category?: string;
  fromDate?: string;
  toDate?: string;
}

// User profile functions
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

// Simple function to get newsletters with pagination
export async function getNewsletters(options) {
  // Use simple implementation to avoid TypeScript errors
  const page = typeof options === 'number' ? options : 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await supabase
    .from("newsletters")
    .select("*", { count: "exact" })
    .range(from, to);
  
  if (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
  
  return { data: data || [], count };
}

export async function getNewsletterById(id) {
  const { data, error } = await supabase
    .from("newsletters")
    .select("*, categories(name, slug, color)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching newsletter:", error);
    throw error;
  }

  return data;
}

export async function saveUserNewsletter(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .insert({
      user_id: userId,
      newsletter_id: newsletterId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving newsletter:", error);
    throw error;
  }

  return data;
}

export async function unsaveUserNewsletter(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .delete()
    .eq("user_id", userId)
    .eq("newsletter_id", newsletterId)
    .select()
    .single();

  if (error) {
    console.error("Error unsaving newsletter:", error);
    throw error;
  }

  return data;
}

export async function getUserSavedNewsletters(userId, page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("saved_newsletters")
    .select("newsletter_id, newsletters!inner(*, categories(name, slug, color))", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching saved newsletters:", error);
    throw error;
  }

  // Transform the data to get just the newsletters
  const newsletters = data.map((item) => item.newsletters);

  return { data: newsletters, count };
}

// Admin stats functions
export async function getAdminStats() {
  const { data, error } = await supabase
    .from("admin_stats")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }

  return data[0] || null;
}

// Category functions
export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data;
}

// Email account functions
export async function getUserEmailAccounts(userId) {
  const { data, error } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching email accounts:", error);
    throw error;
  }

  return data;
}

interface GoogleOAuthResult {
  success: boolean;
  account?: any;
  error?: string;
  details?: any;
  googleError?: string;
  googleErrorDescription?: string;
  statusCode?: number;
  edgeFunctionError?: string;
  tokenInfo?: any;
}

export async function connectGoogleEmail(userId, code, redirectUri): Promise<GoogleOAuthResult> {
  try {
    // Get the redirect URI from env or use the provided one
    const actualRedirectUri = redirectUri || import.meta.env.VITE_REDIRECT_URI || 
      "https://preview--industry-mailbox.lovable.app/admin";
    
    console.log("Using redirect URI for connectGoogleEmail:", actualRedirectUri);
    
    const response = await supabase.functions.invoke("connect-gmail", {
      body: { code, userId, redirectUri: actualRedirectUri },
    });

    // Check if there's an error with the function invocation itself
    if (response.error) {
      console.error("Error invoking connect-gmail function:", response.error);
      return { 
        success: false, 
        error: "Error connecting to Gmail service", 
        edgeFunctionError: response.error.message || String(response.error),
        statusCode: 500  // Use a default status code for error
      };
    }

    // Check for expected data structure
    if (!response.data) {
      console.error("Empty response from connect-gmail function");
      return { 
        success: false, 
        error: "Empty response from server",
        statusCode: 400  // Use a default status code for empty response
      };
    }

    // If there's data but success is false, it means the function returned an error
    if (!response.data.success) {
      console.error("Error in connect-gmail function:", response.data);
      
      // Extract more detailed error information
      return { 
        success: false, 
        error: response.data.error || "Failed to connect Gmail account",
        details: response.data.details || null,
        googleError: response.data.googleError || null,
        googleErrorDescription: response.data.googleErrorDescription || null,
        tokenInfo: response.data.tokenInfo || null,
        statusCode: 400  // Use a default status code for business logic error
      };
    }

    return { 
      success: true, 
      account: response.data.account,
      statusCode: 200  // Use a default status code for success
    };
  } catch (error) {
    console.error("Exception in connectGoogleEmail:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred",
      details: String(error),
      statusCode: 500  // Use a default status code for exception
    };
  }
}

export async function disconnectEmailAccount(accountId) {
  try {
    // First delete the account from the database
    const { error } = await supabase
      .from("email_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      console.error("Error disconnecting email account:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception in disconnectEmailAccount:", error);
    return { success: false, error: error.message };
  }
}

export async function syncEmailAccount(accountId) {
  try {
    const response = await supabase.functions.invoke("sync-emails", {
      body: { accountId },
    });

    if (response.error) {
      console.error("Error invoking sync-emails function:", response.error);
      return { 
        success: false, 
        error: response.error.message || "Error connecting to sync service",
        statusCode: 500  // Use a default status code for error
      };
    }

    if (!response.data || !response.data.success) {
      console.error("Error in sync-emails function:", response.data?.error || "Unknown error");
      return { 
        success: false, 
        error: response.data?.error || "Failed to sync emails",
        details: response.data?.details || null,
        statusCode: 400  // Use a default status code for business logic error
      };
    }

    return { 
      success: true, 
      synced: response.data.synced,
      statusCode: 200  // Use a default status code for success
    };
  } catch (error) {
    console.error("Exception in syncEmailAccount:", error);
    return { success: false, error: error.message };
  }
}

// Alias functions for backward compatibility
export const saveNewsletter = saveUserNewsletter;
export const unsaveNewsletter = unsaveUserNewsletter;

// Check if a newsletter is saved by a user
export async function isNewsletterSaved(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .select("*")
    .eq("user_id", userId)
    .eq("newsletter_id", newsletterId)
    .maybeSingle();

  if (error) {
    console.error("Error checking if newsletter is saved:", error);
    throw error;
  }

  return !!data;
}

// Export the supabase instance for components that need direct access
export { supabase };
