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

// Most simplified approach to avoid TypeScript deep instantiation
export async function getAllNewsletters(
  page = 1, 
  limit = 10, 
  search = "", 
  filters: NewsletterFilters = {}
): Promise<{ data: Newsletter[], count: number | null }> {
  try {
    // Calculate pagination values
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Start with a basic query builder
    let queryBuilder = supabase
      .from("newsletters")
      .select("*, categories(name, slug, color)", { count: "exact" });
    
    // Add filters one by one to avoid complex chaining
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (filters.category) {
      queryBuilder = queryBuilder.eq("category_id", filters.category);
    }
    
    if (filters.fromDate) {
      queryBuilder = queryBuilder.gte("published_date", filters.fromDate);
    }
    
    if (filters.toDate) {
      queryBuilder = queryBuilder.lte("published_date", filters.toDate);
    }
    
    // Add ordering and pagination
    queryBuilder = queryBuilder.order("published_date", { ascending: false });
    queryBuilder = queryBuilder.range(from, to);
    
    // Execute the query
    const response = await queryBuilder;
    
    if (response.error) {
      throw response.error;
    }
    
    return { 
      data: response.data as Newsletter[], 
      count: response.count 
    };
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
}

// Helper function to handle different parameter formats
export async function getNewsletters(options: any): Promise<{ data: Newsletter[], count: number | null }> {
  if (typeof options === 'number') {
    // If options is a number, treat it as page number
    return getAllNewsletters(options, 10, '', {});
  } else {
    // Otherwise, extract search and industries from the options object
    const searchQuery = options?.searchQuery || '';
    const industries = options?.industries || [];
    
    const filters: NewsletterFilters = {};
    if (industries.length > 0) {
      filters.category = industries[0];
    }
    
    return getAllNewsletters(1, 10, searchQuery, filters);
  }
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
