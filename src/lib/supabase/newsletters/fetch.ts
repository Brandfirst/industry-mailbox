
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "../types";
import { NewsletterFilterOptions, NewsletterQueryResult } from "./types";

// Simple function to get newsletters with pagination
export async function getNewsletters(options: NewsletterFilterOptions = {}): Promise<NewsletterQueryResult> {
  // Use simple implementation to avoid TypeScript errors
  const page = options.page || 1;
  const limit = options.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from("newsletters")
    .select("*, categories(id, name, slug, color)");
    
  // Apply filters if provided
  if (options.searchQuery) {
    query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
  }
  
  if (options.sender) {
    query = query.ilike('sender', `%${options.sender}%`);
  }

  if (options.categoryId) {
    const categoryId = typeof options.categoryId === 'string' ? parseInt(options.categoryId) : options.categoryId;
    query = query.eq('category_id', categoryId);
  }

  if (options.fromDate) {
    query = query.gte('published_at', options.fromDate);
  }

  if (options.toDate) {
    // Add a day to include the entire "to" day
    const nextDay = new Date(options.toDate instanceof Date ? options.toDate : new Date(options.toDate));
    nextDay.setDate(nextDay.getDate() + 1);
    query = query.lt('published_at', nextDay.toISOString());
  }
  
  if (options.industries && options.industries.length > 0) {
    query = query.in('industry', options.industries);
  }
  
  const { data, error, count } = await query.range(from, to);
  
  if (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
  
  return { data: data || [], count };
}

// Get newsletters from a specific email account
export async function getNewslettersFromEmailAccount(
  accountId: string, 
  page = 1, 
  limit = 50, 
  filters: NewsletterFilterOptions = {}
): Promise<NewsletterQueryResult> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("newsletters")
      .select("*, categories(id, name, slug, color)", { count: "exact" })
      .eq("email_id", accountId);

    // Apply additional filters
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
    }
    
    if (filters.sender) {
      query = query.ilike('sender', `%${filters.sender}%`);
    }

    if (filters.categoryId) {
      const categoryId = typeof filters.categoryId === 'string' ? parseInt(filters.categoryId) : filters.categoryId;
      query = query.eq('category_id', categoryId);
    }

    if (filters.fromDate) {
      query = query.gte('published_at', filters.fromDate);
    }

    if (filters.toDate) {
      // Add a day to include the entire "to" day
      const nextDay = new Date(filters.toDate instanceof Date ? filters.toDate : new Date(filters.toDate));
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('published_at', nextDay.toISOString());
    }

    const { data, error, count } = await query
      .range(from, to)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching newsletters for email account:", error);
      throw error;
    }

    return { data: data || [], count };
  } catch (error) {
    console.error("Error in getNewslettersFromEmailAccount:", error);
    throw error;
  }
}

export async function getNewsletterById(id: number): Promise<Newsletter> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("*, categories(id, name, slug, color)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching newsletter:", error);
    throw error;
  }

  return data;
}
