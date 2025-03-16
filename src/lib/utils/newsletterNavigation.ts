
import { Newsletter } from '@/lib/supabase/types';

/**
 * Creates a slug-friendly URL path from a newsletter's sender and title
 * @param newsletter The newsletter object
 * @returns The formatted URL path for the newsletter
 */
export const getNewsletterPath = (newsletter: Newsletter): string => {
  if (!newsletter) return '/';
  
  // If we have an ID, use the direct ID route for reliability
  if (newsletter.id) {
    return `/newsletter/${newsletter.id}`;
  }
  
  // Fallback to SEO-friendly route if ID isn't available (shouldn't happen)
  const senderSlug = newsletter.sender_email 
    ? newsletter.sender_email.toLowerCase().replace('@', '-').replace(/\./g, '')
    : (newsletter.sender 
      ? newsletter.sender.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'unknown');
  
  const titleSlug = newsletter.title 
    ? newsletter.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'untitled';
  
  const titleId = `${titleSlug}-${newsletter.id}`;
  
  return `/${senderSlug}/${titleId}`;
};

/**
 * Creates a URL path for a sender to view all newsletters from that sender
 * @param senderName The name of the newsletter sender
 * @returns The formatted URL path for the sender's newsletters
 */
export const getSenderPath = (senderName: string): string => {
  if (!senderName) {
    console.error("No sender name provided");
    return '/search';
  }
  
  console.log("Creating path for sender:", senderName);
  
  // Extract the name part before any email part in angle brackets
  let cleanSenderName = senderName;
  if (senderName.includes('<') && senderName.includes('>')) {
    // Extract just the name part before the email
    cleanSenderName = senderName.split('<')[0].trim();
    console.log("Extracted name part:", cleanSenderName);
  }
  
  // If it's an email address (either standalone or extracted from angle brackets)
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = senderName.match(emailPattern);
  
  if (emailMatch) {
    const email = emailMatch[0];
    const slug = `/sender/${email.toLowerCase().replace('@', '-').replace(/\./g, '')}`;
    console.log("Email sender path:", slug);
    return slug;
  }
  
  // Process the cleaned sender name for a regular name slug
  const senderSlug = cleanSenderName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const path = `/sender/${senderSlug}`;
  console.log("Named sender path:", path);
  return path;
};

/**
 * Navigate to a newsletter detail page
 * @param newsletter The newsletter object
 * @param navigate The navigate function from react-router-dom
 */
export const navigateToNewsletter = (newsletter: Newsletter, navigate: any): void => {
  if (!newsletter) return;
  console.log("Navigating to newsletter:", newsletter.id, newsletter.title);
  const path = getNewsletterPath(newsletter);
  console.log("Navigation path:", path);
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
  
  if (!senderName) {
    console.error("Cannot navigate to sender: No sender name provided");
    return;
  }
  
  console.log("Navigating to sender:", senderName);
  const path = getSenderPath(senderName);
  console.log("Sender navigation path:", path);
  navigate(path);
};
