import { supabase } from "@/integrations/supabase/client";

// Types
export interface Newsletter {
  id: number;
  title: string;
  sender: string;
  industry: string;
  preview: string;
  content: string | null;
  published_at: string;
  created_at: string;
  categories?: any;
  email_id?: string;
  sender_email?: string;
  category_id?: number;
  gmail_message_id?: string;
  gmail_thread_id?: string;
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

export interface NewsletterCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  created_at?: string;
}

// Extended interface for categories with newsletter count
export interface CategoryWithStats extends NewsletterCategory {
  count?: number;
  newsletterCount?: number;
}

// Simple interface to avoid deep type instantiation
export interface NewsletterFilters {
  category?: string;
  fromDate?: string;
  toDate?: string;
  searchQuery?: string;
  sender?: string;
}

export interface GoogleOAuthResult {
  success: boolean;
  account?: any;
  error?: string;
  details?: any;
  googleError?: string;
  googleErrorDescription?: string;
  statusCode?: number;
  edgeFunctionError?: string;
  tokenInfo?: any;
}
