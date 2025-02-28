
import { supabase } from "@/integrations/supabase/client";

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

export async function getAllNewsletters(page = 1, limit = 10, search = "", filters = {}) {
  let query = supabase
    .from("newsletters")
    .select("*, categories(name, slug, color)", { count: "exact" });

  // Apply search if provided
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply category filter
  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }

  // Apply date filter
  if (filters.fromDate) {
    query = query.gte("published_date", filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte("published_date", filters.toDate);
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  // Order by published date
  query = query.order("published_date", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }

  return { data, count };
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
    .from("user_saved_newsletters")
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
    .from("user_saved_newsletters")
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
    .from("user_saved_newsletters")
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

export async function connectGoogleEmail(userId, code) {
  try {
    // Get the current location's origin for the redirect URI
    let origin = window.location.origin;
    
    // If we're on a preview domain, format it correctly
    if (origin.includes('preview--')) {
      const match = origin.match(/https:\/\/preview--([^.]+)\.([^/]+)/);
      if (match) {
        origin = `https://preview--${match[1]}.${match[2]}`;
      }
    }
    
    console.log("Using origin for redirect:", origin);
    
    const { data, error } = await supabase.functions.invoke("connect-gmail", {
      body: { code, userId, origin },
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
