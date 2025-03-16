
/**
 * Content module responsible for handling email content cleaning and processing
 */
import { TrackingDomain } from "./types.ts";

/**
 * List of known tracking domains to filter out
 */
export const TRACKING_DOMAINS: TrackingDomain[] = [
  { domain: "rs6.net", name: "Constant Contact" },
  { domain: "mailchimp.com", name: "Mailchimp" },
  { domain: "list-manage.com", name: "Mailchimp" },
  { domain: "cmail19.com", name: "Campaign Monitor" },
  { domain: "cmail20.com", name: "Campaign Monitor" },
  { domain: "awesomemotive.com", name: "OptinMonster" },
  { domain: "infusionsoft.com", name: "Infusionsoft" },
  { domain: "getresponse.com", name: "GetResponse" },
  { domain: "exacttarget.com", name: "Salesforce" },
  { domain: "postoffice.pinterest.com", name: "Pinterest" },
  { domain: "sailthru.com", name: "Sailthru" },
  { domain: "ml.mailersend.com", name: "MailerSend" },
  { domain: "e.linkedin.com", name: "LinkedIn" },
  { domain: "amazonses.com", name: "Amazon SES" }
];

/**
 * Remove tracking pixels from email content
 */
export function removeTrackingPixels(html: string): string {
  // Attempt to remove common tracking pixels
  return html
    // Remove 1x1 pixel images (common tracking pixels)
    .replace(/<img[^>]+width=(["'])1\1[^>]+height=(["'])1\2[^>]*>/gi, '')
    .replace(/<img[^>]+height=(["'])1\1[^>]+width=(["'])1\2[^>]*>/gi, '')
    
    // Remove images with no src or with tracking domains
    .replace(
      /<img[^>]+(src=(["'])[^"']*(?:track|pixel|open|beacon|stat)[^"']*\2)[^>]*>/gi,
      ''
    );
}

/**
 * Clean HTML content by removing tracking elements
 */
export function cleanHtml(html: string): string {
  if (!html) return '';
  
  // First pass - basic tracking removal
  let cleanedHtml = removeTrackingPixels(html);
  
  // Second pass - remove onclick attributes that might contain tracking
  cleanedHtml = cleanedHtml.replace(/\sonclick=["'][^"']*["']/gi, '');
  
  // Third pass - clean up any leftover tracking scripts
  cleanedHtml = cleanedHtml.replace(/<script[^>]*>[^<]*(?:tracking|analytics|gtag|pixel)[^<]*<\/script>/gi, '');
  
  return cleanedHtml;
}

/**
 * Extract plain text from HTML content
 */
export function htmlToText(html: string): string {
  // Very simple HTML to text conversion
  return html
    .replace(/<[^>]*>/g, ' ') // Replace tags with spaces
    .replace(/\s+/g, ' ')     // Collapse whitespace
    .trim();                  // Remove leading/trailing whitespace
}

/**
 * Create a preview snippet from content
 */
export function createPreview(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Convert to text if it's HTML
  const text = content.startsWith('<') ? htmlToText(content) : content;
  
  // Truncate and add ellipsis if needed
  if (text.length <= maxLength) return text;
  
  // Find a good breaking point
  const breakPoint = text.lastIndexOf(' ', maxLength);
  return breakPoint > 0 ? text.substring(0, breakPoint) + '...' : text.substring(0, maxLength) + '...';
}

/**
 * Helper function to ensure HTML has proper structure
 */
export function ensureProperHtmlStructure(html: string): string {
  // Add meta charset if not present
  if (!html.includes('<meta charset="utf-8">') && !html.includes('<head>')) {
    html = `<html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
  } else if (!html.includes('<meta charset="utf-8">') && html.includes('<head>')) {
    html = html.replace('<head>', '<head><meta charset="utf-8">');
  }
  return html;
}

/**
 * Decode and process content from Gmail API
 */
export function decodeGmailContent(encodedContent: string): string {
  // Gmail API returns base64url encoded content
  try {
    // Convert from base64url to base64
    const base64 = encodedContent.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 to a string
    const decoded = atob(base64);
    
    return decoded;
  } catch (error) {
    console.error('Error decoding Gmail content:', error);
    return '';
  }
}
