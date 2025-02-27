
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
  id: string;
  title: string;
  sender: string;
  industry: string;
  preview: string;
  content: string;
  created_at: string;
  published_at: string;
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

export async function saveNewsletter(userId: string, newsletterId: string) {
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

export async function unsaveNewsletter(userId: string, newsletterId: string) {
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

export async function isNewsletterSaved(userId: string, newsletterId: string) {
  const { data, error } = await supabase
    .from('saved_newsletters')
    .select('*')
    .match({ user_id: userId, newsletter_id: newsletterId })
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    console.error('Error checking if newsletter is saved:', error);
    throw error;
  }

  return !!data;
}
