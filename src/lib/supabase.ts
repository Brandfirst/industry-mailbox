
import { createClient } from '@supabase/supabase-js';

// Default to empty strings or test values if environment variables are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log warning but don't throw error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing environment variables for Supabase. Using placeholder values for development.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function getNewsletters({ 
  searchQuery = '', 
  industries = [] 
}: { 
  searchQuery?: string;
  industries?: string[];
}) {
  try {
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
