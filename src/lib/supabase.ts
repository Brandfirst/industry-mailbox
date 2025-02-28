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

// Define filters interface to avoid excessive type instantiation
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

// Newsletter functions

export async function getAllNewsletters(
  page = 1, 
  limit = 10, 
  search = "", 
  filters: NewsletterFilters = {}
) {
  // Calculate pagination values
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  // Define a base query
  const query = supabase.from("newsletters");
  
  // Add select part
  const queryWithSelect = query.select("*, categories(name, slug, color)", { count: "exact" });
  
  // Apply search if provided
  let filteredQuery = queryWithSelect;
  if (search) {
    filteredQuery = filteredQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  // Apply category filter if present
  if (filters.category) {
    filteredQuery = filteredQuery.eq("category_id", filters.category);
  }
  
  // Apply date filters if present
  if (filters.fromDate) {
    filteredQuery = filteredQuery.gte("published_date", filters.fromDate);
  }
  
  if (filters.toDate) {
    filteredQuery = filteredQuery.lte("published_date", filters.toDate);
  }
  
  // Apply ordering and pagination
  const finalQuery = filteredQuery
    .order("published_date", { ascending: false })
    .range(from, to);
  
  // Execute the final query
  const { data, error, count } = await finalQuery;
  
  if (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
  
  return { data, count };
}

// Define a separate type for getNewsletters options
export type GetNewslettersOptions = number | {
  searchQuery?: string; 
  industries?: string[];
};

// Support for legacy interface - accepts an object with searchQuery and industries
export async function getNewsletters(options: GetNewslettersOptions) {
  // If options is a plain number, treat it as the page number
  if (typeof options === 'number') {
    return getAllNewsletters(options);
  }
  
  // Otherwise, extract properties from the options object
  const { searchQuery = "", industries = [] } = options || {};
  const filters: NewsletterFilters = {};
  
  // Map industries to category if needed
  if (industries && industries.length > 0) {
    filters.category = industries[0]; // Just use the first one for simplicity
  }
  
  return getAllNewsletters(1, 10, searchQuery, filters);
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
}

export async function connectGoogleEmail(userId, code): Promise<GoogleOAuthResult> {
  try {
    // Get the current location's origin for the redirect URI
    // Use the specific redirect URI that matches Google Cloud Console
    const redirectUri = "https://feb48f71-47d1-4ebf-85de-76618e7c453a.lovableproject.com/admin";
    
    console.log("Using hardcoded redirect URI for connectGoogleEmail:", redirectUri);
    
    const { data, error } = await supabase.functions.invoke("connect-gmail", {
      body: { code, userId, redirectUri },
    });

    if (error) {
      console.error("Error connecting Gmail:", error);
      return { success: false, error: error.message || "Failed to connect to Gmail" };
    }

    if (!data.success) {
      console.error("Error in connect-gmail function:", data.error);
      return { 
        success: false, 
        error: data.error || "Failed to connect Gmail account",
        details: data.details || data.googleError || data.googleErrorDescription
      };
    }

    return { success: true, account: data.account };
  } catch (error) {
    console.error("Exception in connectGoogleEmail:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
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
    const { data, error } = await supabase.functions.invoke("sync-emails", {
      body: { accountId },
    });

    if (error) {
      console.error("Error syncing emails:", error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      console.error("Error in sync-emails function:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true, synced: data.synced };
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
