
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

/**
 * Navigate to a newsletter detail page
 * @param newsletter The newsletter object
 * @param navigate The navigate function from react-router-dom
 */
export const navigateToNewsletter = (newsletter: Newsletter, navigate: any): void => {
  if (!newsletter) return;
  const path = getNewsletterPath(newsletter);
  navigate(path);
};

/**
 * Navigate to a sender's page showing all newsletters from that sender
 * @param senderName The sender name
 * @param navigate The navigate function from react-router-dom
 * @param event The click event (optional)
 */
export const navigateToSender = (senderName: string, navigate: any, event?: React.MouseEvent): void => {
  if (event) {
    event.stopPropagation();
  }
  if (!senderName) return;
  const path = getSenderPath(senderName);
  navigate(path);
};
