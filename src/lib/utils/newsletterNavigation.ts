
import { Newsletter } from '@/lib/supabase/types';

/**
 * Creates a slug-friendly URL path from a newsletter's sender and title
 * @param newsletter The newsletter object
 * @returns The formatted URL path for the newsletter
 */
export const getNewsletterPath = (newsletter: Newsletter): string => {
  if (!newsletter) return '/';
  
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
  if (!senderName) return '/search';
  
  // If it's an email address, create a slug from it
  if (senderName.includes('@')) {
    return `/sender/${senderName.toLowerCase().replace('@', '-').replace(/\./g, '')}`;
  }
  
  const senderSlug = senderName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
