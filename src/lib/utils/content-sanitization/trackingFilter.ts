
/**
 * Utility for identifying and removing tracking elements from newsletter content
 */

// List of common tracking domains and patterns
const TRACKING_DOMAINS = [
  'analytics', 'track', 'click', 'open', 'mail', 'url', 'beacon', 'wf', 'ea', 'stat',
  'vitavenn', 'boozt', 'everestengagement', 'email.booztlet', 
  'wuGK4U8731', 'open.aspx', 'JGZ2HocBug'
];

// Additional specific domains from error logs
const SPECIFIC_TRACKING_DOMAINS = [
  'analytics.boozt.com',
  'url2879.vitavenn.vita.no',
  'vitavenn.vita.no'
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
  /click\./i,
  /JGZ2HocBug/i,  // From error logs
  /wuGK4U8731/i   // From error logs
];

/**
 * Checks if a URL is likely a tracking URL based on known patterns
 */
export const isTrackingUrl = (url: string): boolean => {
  // Check against known specific tracking domains first (exact matches)
  if (SPECIFIC_TRACKING_DOMAINS.some(domain => url.includes(domain))) {
    return true;
  }
  
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
 * Process content to remove all tracking elements before rendering
 * This more aggressive approach removes tracking at the HTML processing stage
 */
export const removeTrackingElements = (content: string): string => {
  if (!content) return '';
  
  let cleanedContent = content;
  
  // 1. Remove all tracking image tags completely (more aggressive than before)
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"]([^'"]+)['"][^>]*>/gi,
    (match, src) => {
      if (isTrackingUrl(src)) {
        return ''; // Completely remove tracking images
      }
      return match;
    }
  );
  
  // 2. Remove tracking links but preserve their inner content
  cleanedContent = cleanedContent.replace(
    /<a[^>]*?href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi,
    (match, href, innerContent) => {
      if (isTrackingUrl(href)) {
        return innerContent;
      }
      return match;
    }
  );
  
  // 3. Remove all script tags (they're disabled by CSP anyway)
  cleanedContent = cleanedContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
    ''
  );
  
  // 4. Remove inline event handlers (onclick, onload, etc.)
  cleanedContent = cleanedContent.replace(
    /\s(on\w+)=['"]([^'"]*)['"]/gi,
    ''
  );
  
  // 5. Remove tracking pixels with very long URLs (common in newsletters)
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"][^'"]{150,}['"][^>]*>/gi,
    ''
  );
  
  // 6. Remove specific problematic iframe content
  cleanedContent = cleanedContent.replace(
    /<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, 
    ''
  );
  
  // 7. Remove all meta refresh tags that could cause redirects
  cleanedContent = cleanedContent.replace(
    /<meta[^>]*?http-equiv=['"]refresh['"][^>]*>/gi,
    ''
  );
  
  // 8. Remove problematic link tags to external stylesheets that might contain tracking
  cleanedContent = cleanedContent.replace(
    /<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, 
    ''
  );
  
  return cleanedContent;
};

/**
 * Backward compatibility with existing code
 */
export const removeTrackingPixels = (content: string): string => {
  return removeTrackingElements(content);
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
    'allow-scripts',
    'JGZ2HocBug',
    'boozt.com',
    'vitavenn',
    'wf/open'
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
