
import { Newsletter } from "@/lib/supabase/types";

/**
 * Generate a consistent URL path for a newsletter
 */
export const getNewsletterPath = (newsletter: Newsletter): string => {
  if (!newsletter.id) return '/';
  return `/newsletter/${newsletter.id}`;
};

/**
 * Generate a consistent URL path for a sender
 */
export const getSenderPath = (sender: string): string => {
  if (!sender) return '/search';
  // Create a URL-friendly slug from the sender name
  const senderSlug = sender.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .trim();
  return `/sender/${senderSlug}`;
};
