
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

// Simplified approach to avoid TypeScript deep instantiation
export async function getAllNewsletters(
  page = 1, 
  limit = 10, 
  search = "", 
  filters: NewsletterFilters = {}
) {
  try {
    // Calculate pagination values
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Build query parts without chaining to avoid TypeScript complexity
    let query = `*, categories(name, slug, color)`;
    let conditions = [];
    let queryParams: any = {};
    
    // Add search condition if provided
    if (search) {
      conditions.push(`(title.ilike.%${search}% OR description.ilike.%${search}%)`);
    }
    
    // Add category filter
    if (filters.category) {
      conditions.push("category_id=:categoryId");
      queryParams.categoryId = filters.category;
    }
    
    // Add date filters
    if (filters.fromDate) {
      conditions.push("published_date>=:fromDate");
      queryParams.fromDate = filters.fromDate;
    }
    
    if (filters.toDate) {
      conditions.push("published_date<=:toDate");
      queryParams.toDate = filters.toDate;
    }
    
    // Execute the query with all conditions
    let finalQuery = supabase.from("newsletters").select(query, { count: "exact" });
    
    // Apply filters as conditions
    if (conditions.length > 0) {
      // Use simple .eq, .gte, etc. rather than complex filter chains
      if (filters.category) {
        finalQuery = finalQuery.eq("category_id", filters.category);
      }
      
      if (filters.fromDate) {
        finalQuery = finalQuery.gte("published_date", filters.fromDate);
      }
      
      if (filters.toDate) {
        finalQuery = finalQuery.lte("published_date", filters.toDate);
      }
      
      // Apply text search last
      if (search) {
        finalQuery = finalQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
    }
    
    // Apply ordering and pagination as separate operations
    finalQuery = finalQuery.order("published_date", { ascending: false });
    finalQuery = finalQuery.range(from, to);
    
    // Execute query
    const { data, error, count } = await finalQuery;
    
    if (error) throw error;
    
    return { data, count };
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
}

// Using a different approach for getNewsletters to avoid type issues
export function getNewsletters(options: number | { searchQuery?: string; industries?: string[] }) {
  // Handle numeric case (page number)
  if (typeof options === 'number') {
    return getAllNewsletters(options, 10, '', {});
  }
  
  // Handle object case with options
  const opts = options as { searchQuery?: string; industries?: string[] };
  const searchQuery = opts?.searchQuery || '';
  const industries = opts?.industries || [];
  
  const filters: NewsletterFilters = {};
  if (industries.length > 0) {
    filters.category = industries[0];
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
    // Use the exact redirect URI that's configured in your Google Cloud Console
    // This must match exactly what's in the console
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
