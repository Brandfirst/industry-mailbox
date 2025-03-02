
import { Newsletter } from '@/lib/supabase/types';

/**
 * Creates a slug-friendly URL path from a newsletter's sender and title
 * @param newsletter The newsletter object
 * @returns The formatted URL path for the newsletter
 */
export const getNewsletterPath = (newsletter: Newsletter): string => {
  if (!newsletter) return '/';
  
  const senderSlug = newsletter.sender 
    ? newsletter.sender.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'unknown';
  
  const titleSlug = newsletter.title 
    ? newsletter.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'untitled';
  
  const titleId = `${titleSlug}-${newsletter.id}`;
  
  return `/${senderSlug}/${titleId}`;
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
