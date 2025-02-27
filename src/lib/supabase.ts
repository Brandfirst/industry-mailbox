
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables for Supabase');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
    throw error;
  }

  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
}

export async function saveNewsletter(userId: string, newsletterId: number) {
  const { data, error } = await supabase
    .from('saved_newsletters')
    .insert([
      { user_id: userId, newsletter_id: newsletterId }
    ]);

  if (error) {
    console.error('Error saving newsletter:', error);
    throw error;
  }

  return data;
}

export async function unsaveNewsletter(userId: string, newsletterId: number) {
  const { data, error } = await supabase
    .from('saved_newsletters')
    .delete()
    .match({ user_id: userId, newsletter_id: newsletterId });

  if (error) {
    console.error('Error removing saved newsletter:', error);
    throw error;
  }

  return data;
}

export async function isNewsletterSaved(userId: string, newsletterId: number) {
  const { data, error } = await supabase
    .from('saved_newsletters')
    .select('*')
    .match({ user_id: userId, newsletter_id: newsletterId })
    .maybeSingle();

  if (error) {
    console.error('Error checking if newsletter is saved:', error);
    throw error;
  }

  return !!data;
}

export async function getSavedNewsletters(userId: string) {
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
    throw error;
  }

  // Extract the actual newsletter objects
  return data.map(item => item.newsletters);
}

export async function getNewsletter(id: number) {
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching newsletter:', error);
    throw error;
  }

  return data;
}

// Admin functions
export async function createNewsletter(newsletter: Omit<Newsletter, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('newsletters')
    .insert([newsletter])
    .select()
    .single();

  if (error) {
    console.error('Error creating newsletter:', error);
    throw error;
  }

  return data;
}

export async function updateNewsletter(id: number, newsletter: Partial<Omit<Newsletter, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('newsletters')
    .update(newsletter)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating newsletter:', error);
    throw error;
  }

  return data;
}

export async function deleteNewsletter(id: number) {
  const { error } = await supabase
    .from('newsletters')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting newsletter:', error);
    throw error;
  }

  return true;
}
