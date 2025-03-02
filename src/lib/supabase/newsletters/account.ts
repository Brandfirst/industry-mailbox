
import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";

const ITEMS_PER_PAGE = 10;

/**
 * Fetches newsletters with pagination and filtering.
 */
export async function getNewslettersFromEmailAccount(
  accountId: string | null,
  page: number,
  filters: NewsletterFilters
): Promise<{ data: Newsletter[]; error: any; total: number }> {
  if (!accountId) {
    return { data: [], error: null, total: 0 };
  }

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  let query = supabase
    .from("newsletters")
    .select("*", { count: "exact" })
    .eq("email_id", accountId)
    .order("published_at", { ascending: false });

  if (filters.searchQuery) {
    query = query.ilike("title", `%${filters.searchQuery}%`);
  }

  if (filters.sender) {
    query = query.ilike("sender", `%${filters.sender}%`);
  }

  if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", Number(filters.category));
  }

  if (filters.fromDate) {
    query = query.gte("published_at", filters.fromDate);
  }

  if (filters.toDate) {
    query = query.lte("published_at", filters.toDate);
  }

  query = query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

  const { data, error, count } = await query;

  return { data: data || [], error, total: count || 0 };
}
