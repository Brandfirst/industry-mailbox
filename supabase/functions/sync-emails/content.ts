
// Ensure HTML has proper document structure
export function ensureProperHtmlStructure(html) {
  // Check if HTML has a DOCTYPE declaration
  if (!html.trim().toLowerCase().startsWith('<!doctype')) {
    return `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              </head>
              <body>${html}</body>
            </html>`;
  } else {
    // If it has a doctype, check for head tags
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      // Add meta charset tag to existing head if not present
      if (!headMatch[1].includes('charset')) {
        return html.replace(
          headMatch[0], 
          `<head${headMatch[0].substring(5, headMatch[0].indexOf('>'))}>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            ${headMatch[1]}
          </head>`
        );
      }
    } else if (html.includes('<html')) {
      // Add head with meta charset if no head exists
      return html.replace(
        /<html[^>]*>/i,
        `$&<head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>`
      );
    }
  }
  
  return html;
}

// Remove tracking elements from content
export function removeTrackingElements(content) {
  if (!content) return '';
  
  let cleanedContent = content;
  
  // 1. Remove all tracking image tags
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"]([^'"]+)['"][^>]*>/gi,
    (match, src) => {
      if (isTrackingUrl(src)) {
        return ''; // Remove tracking images
      }
      return match;
    }
  );
  
  // 2. Remove tracking links but preserve inner content
  cleanedContent = cleanedContent.replace(
    /<a[^>]*?href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi,
    (match, href, innerContent) => {
      if (isTrackingUrl(href)) {
        return innerContent;
      }
      return match;
    }
  );
  
  // 3. Remove all script tags
  cleanedContent = cleanedContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
    ''
  );
  
  // 4. Remove inline event handlers
  cleanedContent = cleanedContent.replace(
    /\s(on\w+)=['"]([^'"]*)['"]/gi,
    ''
  );
  
  // 5. Remove tracking pixels with long URLs
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"][^'"]{150,}['"][^>]*>/gi,
    ''
  );
  
  // 6. Remove iframe content
  cleanedContent = cleanedContent.replace(
    /<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, 
    ''
  );
  
  // 7. Remove meta refresh tags
  cleanedContent = cleanedContent.replace(
    /<meta[^>]*?http-equiv=['"]refresh['"][^>]*>/gi,
    ''
  );
  
  // 8. Remove problematic link tags
  cleanedContent = cleanedContent.replace(
    /<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, 
    ''
  );
  
  // 9. Remove specific problematic domains
  const specificDomains = ['analytics.boozt.com', 'url2879.vitavenn.vita.no', 'vitavenn.vita.no'];
  cleanedContent = cleanedContent.replace(
    new RegExp(`<[^>]*?(?:src|href)=['"]https?://(?:[^'"]*?)(${specificDomains.join('|')})([^'"]*?)['"][^>]*>`, 'gi'),
    ''
  );
  
  // 10. Remove specific tracking patterns
  cleanedContent = cleanedContent.replace(
    /<[^>]*?(?:src|href)=['"][^'"]*?(?:JGZ2HocBug|wuGK4U8731)[^'"]*?['"][^>]*>/gi,
    ''
  );
  
  return cleanedContent;
}

// Check if URL is likely a tracking URL
export function isTrackingUrl(url) {
  // List of common tracking domains and patterns
  const trackingDomains = [
    'analytics', 'track', 'click', 'open', 'mail', 'url', 'beacon', 'wf', 'ea', 'stat',
    'vitavenn', 'boozt', 'everestengagement', 'email.booztlet', 
    'wuGK4U8731', 'open.aspx', 'JGZ2HocBug'
  ];

  // Additional specific domains from error logs
  const specificTrackingDomains = [
    'analytics.boozt.com',
    'url2879.vitavenn.vita.no',
    'vitavenn.vita.no'
  ];

  // Common tracking URL patterns
  const trackingPatterns = [
    /\/open\.aspx/i,
    /\/wf\/open/i,
    /\/ea\/\w+/i,
    /[?&](utm_|trk|tracking|cid|eid|sid)/i,
    /\.gif(\?|$)/i,
    /pixel\.(gif|png|jpg)/i,
    /beacon\./i,
    /click\./i,
    /JGZ2HocBug/i,
    /wuGK4U8731/i
  ];
  
  // Check against known specific tracking domains first
  if (specificTrackingDomains.some(domain => url.includes(domain))) {
    return true;
  }
  
  // Check against known tracking domains
  if (trackingDomains.some(domain => url.includes(domain))) {
    return true;
  }
  
  // Check against known tracking patterns
  if (trackingPatterns.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Additional check for long query parameters
  if (url.includes('?') && url.length > 100 && /[?&].{30,}/.test(url)) {
    return true;
  }
  
  return false;
}
