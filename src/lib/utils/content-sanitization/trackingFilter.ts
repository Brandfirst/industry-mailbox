
/**
 * Utility for identifying and removing tracking elements from newsletter content
 */

// List of common tracking domains and patterns
const TRACKING_DOMAINS = [
  'analytics', 'track', 'click', 'open', 'mail', 'url', 'beacon', 'wf', 'ea', 'stat',
  'vitavenn', 'boozt', 'everestengagement', 'email.booztlet', 
  'wuGK4U8731', 'open.aspx', 'JGZ2HocBug'
];

// Common tracking URL patterns
const TRACKING_PATTERNS = [
  /\/open\.aspx/i,
  /\/wf\/open/i,
  /\/ea\/\w+/i,
  /[?&](utm_|trk|tracking|cid|eid|sid)/i,
  /\.gif(\?|$)/i,
  /pixel\.(gif|png|jpg)/i,
  /beacon\./i,
  /click\./i
];

/**
 * Checks if a URL is likely a tracking URL based on known patterns
 */
export const isTrackingUrl = (url: string): boolean => {
  // Check against known tracking domains
  if (TRACKING_DOMAINS.some(domain => url.includes(domain))) {
    return true;
  }
  
  // Check against known tracking patterns
  if (TRACKING_PATTERNS.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Additional checks for long query parameters which often indicate tracking
  if (url.includes('?') && url.length > 100 && /[?&].{30,}/.test(url)) {
    return true;
  }
  
  return false;
};

/**
 * Removes tracking pixels from HTML content
 */
export const removeTrackingPixels = (content: string): string => {
  // Remove tracking image tags based on the URL patterns
  let cleanedContent = content.replace(
    /<img[^>]*?src=['"]([^'"]+)['"][^>]*>/gi,
    (match, src) => {
      if (isTrackingUrl(src)) {
        return '<!-- tracking pixel removed -->';
      }
      return match;
    }
  );
  
  // Remove tracking links
  cleanedContent = cleanedContent.replace(
    /<a[^>]*?href=['"]([^'"]+)['"][^>]*>(.+?)<\/a>/gi,
    (match, href, innerContent) => {
      if (isTrackingUrl(href)) {
        return innerContent;
      }
      return match;
    }
  );
  
  return cleanedContent;
};

/**
 * Console error suppressor for common tracking/certificate errors
 * Can be added to window.onerror handlers
 */
export const shouldSuppressError = (errorMsg: string | Event): boolean => {
  if (!errorMsg) return false;
  
  // Convert Event objects to string if needed
  const errorString = typeof errorMsg === 'string' 
    ? errorMsg 
    : (errorMsg as any).message || String(errorMsg);
  
  // Common certificate error patterns
  const suppressPatterns = [
    'ERR_CERT_COMMON_NAME_INVALID',
    'ERR_CERT_AUTHORITY_INVALID',
    'certificate',
    'tracking',
    'analytics',
    'net::ERR',
    'Blocked script execution',
    'sandbox',
    'allow-scripts'
  ];
  
  return suppressPatterns.some(pattern => 
    errorString.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Generates the Content Security Policy for iframe content
 */
export const getSecureCSP = (): string => {
  return `
    upgrade-insecure-requests; 
    script-src 'none'; 
    img-src 'self' data: https:; 
    connect-src 'none'; 
    frame-src 'none';
    object-src 'none';
  `.trim();
};
