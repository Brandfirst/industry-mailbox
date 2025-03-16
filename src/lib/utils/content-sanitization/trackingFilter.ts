/**
 * Utility functions for filtering tracking elements and sanitizing content
 */

/**
 * Better tracking pixel removal that preserves legitimate images
 * @param html HTML content to clean
 * @returns Cleaned HTML with tracking pixels removed
 */
export function removeTrackingPixels(html: string): string {
  if (!html) return '';
  
  let cleaned = html;
  
  // Remove common tracking pixels (1x1 or 0x0 images)
  cleaned = cleaned.replace(/<img[^>]*(?:height=(["'])(?:0|1)\\1[^>]*width=(["'])(?:0|1)\\2|width=(["'])(?:0|1)\\3[^>]*height=(["'])(?:0|1)\\4)[^>]*>/gi, '<!-- tracking pixel removed -->');
  
  // Remove images with tracking domains but preserve legitimate images
  cleaned = cleaned.replace(/<img[^>]*src=(["'])https?:\/\/([^"'\/]+)\.(?:mail|click|url|send|analytics|track|open|beacon|wf|ea|stat)[^"']*\1[^>]*>/gi, '<!-- tracking pixel removed -->');
  
  // Remove hidden images
  cleaned = cleaned.replace(/<img[^>]*style=(["'])[^"']*(?:visibility:\s*hidden|display:\s*none)[^"']*\1[^>]*>/gi, '<!-- hidden image removed -->');
  
  // Force HTTPS for all images
  cleaned = cleaned.replace(/(<img[^>]*src=["'])http:\/\/([^"']+["'][^>]*>)/gi, '$1https://$2');
  
  return cleaned;
}

/**
 * Determine if an error should be suppressed (related to tracking/security)
 * @param error Error object or message
 * @returns True if error should be suppressed
 */
export function shouldSuppressError(error: any): boolean {
  const errorStr = typeof error === 'string' ? error : 
                  error?.message || 
                  (error?.toString ? error.toString() : '');
  
  // Check if the error is related to tracking or network security
  return errorStr.includes('certificate') || 
         errorStr.includes('tracking') || 
         errorStr.includes('analytics') ||
         errorStr.includes('ERR_CERT') ||
         errorStr.includes('net::') ||
         errorStr.includes('blocked') ||
         errorStr.includes('mixed content') ||
         errorStr.includes('unsafe');
}

/**
 * Get Content Security Policy string that allows legitimate content
 * but blocks tracking and unsafe elements
 */
export function getSecureCSP(): string {
  return "upgrade-insecure-requests; script-src 'none'; img-src 'self' data: https:; connect-src 'none'; frame-src 'none'";
}
