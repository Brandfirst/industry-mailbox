
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client and validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Utility to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

export type Newsletter = {
  id: number;
  title: string;
  sender: string;
  industry: string;
  preview: string;
  content: string;
  created_at: string;
  published_at: string;
}

export type Category = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export type EmailAccount = {
  id: string;
  user_id: string;
  email: string;
  provider: string;
  access_token: string;
  refresh_token: string;
  created_at: string;
  last_sync: string | null;
  is_connected: boolean;
}

export async function getNewsletters({ 
  searchQuery = '', 
  industries = [] 
}: { 
  searchQuery?: string;
  industries?: string[];
}) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Using mock data.');
      return [];
    }

    let query = supabase
      .from('newsletters')
      .select('*')
      .order('published_at', { ascending: false });

    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,preview.ilike.%${searchQuery}%,sender.ilike.%${searchQuery}%`
      );
    }

    // Apply industry filter if provided
    if (industries.length > 0) {
      query = query.in('industry', industries);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching newsletters:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getNewsletters:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Using mock data.');
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

export async function saveNewsletter(userId: string, newsletterId: number) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot save newsletter.');
      return null;
    }

    const { data, error } = await supabase
      .from('saved_newsletters')
      .insert([
        { user_id: userId, newsletter_id: newsletterId }
      ]);

    if (error) {
      console.error('Error saving newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveNewsletter:', error);
    return null;
  }
}

export async function unsaveNewsletter(userId: string, newsletterId: number) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot unsave newsletter.');
      return null;
    }

    const { data, error } = await supabase
      .from('saved_newsletters')
      .delete()
      .match({ user_id: userId, newsletter_id: newsletterId });

    if (error) {
      console.error('Error removing saved newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in unsaveNewsletter:', error);
    return null;
  }
}

export async function isNewsletterSaved(userId: string, newsletterId: number) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot check if newsletter is saved.');
      return false;
    }

    const { data, error } = await supabase
      .from('saved_newsletters')
      .select('*')
      .match({ user_id: userId, newsletter_id: newsletterId })
      .maybeSingle();

    if (error) {
      console.error('Error checking if newsletter is saved:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isNewsletterSaved:', error);
    return false;
  }
}

export async function getSavedNewsletters(userId: string) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot fetch saved newsletters.');
      return [];
    }

    const { data, error } = await supabase
      .from('saved_newsletters')
      .select(`
        id,
        newsletter_id,
        newsletters:newsletter_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching saved newsletters:', error);
      return [];
    }

    // Extract the actual newsletter objects
    return data ? data.map(item => item.newsletters) : [];
  } catch (error) {
    console.error('Error in getSavedNewsletters:', error);
    return [];
  }
}

export async function getNewsletter(id: number) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot fetch newsletter.');
      return null;
    }

    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getNewsletter:', error);
    return null;
  }
}

// Admin functions
export async function createNewsletter(newsletter: Omit<Newsletter, 'id' | 'created_at'>) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot create newsletter.');
      return null;
    }

    const { data, error } = await supabase
      .from('newsletters')
      .insert([newsletter])
      .select()
      .single();

    if (error) {
      console.error('Error creating newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createNewsletter:', error);
    return null;
  }
}

export async function updateNewsletter(id: number, newsletter: Partial<Omit<Newsletter, 'id' | 'created_at'>>) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot update newsletter.');
      return null;
    }

    const { data, error } = await supabase
      .from('newsletters')
      .update(newsletter)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating newsletter:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateNewsletter:', error);
    return null;
  }
}

export async function deleteNewsletter(id: number) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot delete newsletter.');
      return false;
    }

    const { error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting newsletter:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteNewsletter:', error);
    return false;
  }
}

// Email account integration functions
export async function getUserEmailAccounts(userId: string) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot fetch email accounts.');
      return [];
    }

    const { data, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching email accounts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserEmailAccounts:', error);
    return [];
  }
}

export async function connectGoogleEmail(userId: string, authCode: string) {
  try {
    // Call the Supabase Edge Function to handle the OAuth token exchange
    const { data, error } = await supabase.functions.invoke('connect-gmail', {
      body: {
        userId,
        authCode
      }
    });

    if (error) {
      console.error('Error connecting Gmail account:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in connectGoogleEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function disconnectEmailAccount(accountId: string) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not properly configured. Cannot disconnect email account.');
      return { success: false };
    }

    const { error } = await supabase
      .from('email_accounts')
      .update({ is_connected: false })
      .eq('id', accountId);

    if (error) {
      console.error('Error disconnecting email account:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in disconnectEmailAccount:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function syncEmailAccount(accountId: string) {
  try {
    // Call the Supabase Edge Function to trigger email sync
    const { data, error } = await supabase.functions.invoke('sync-emails', {
      body: { accountId }
    });

    if (error) {
      console.error('Error syncing email account:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in syncEmailAccount:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}
