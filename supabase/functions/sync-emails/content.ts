
/**
 * Decodes base64 Gmail content
 * @param encoded The base64 encoded content from Gmail API
 * @returns Decoded content as string
 */
export function decodeGmailContent(encoded) {
  try {
    // Gmail API uses URL-safe base64 encoding with padding sometimes removed
    // Replace non-alphabet chars and add padding if needed
    const sanitized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = sanitized.padEnd(sanitized.length + (4 - sanitized.length % 4) % 4, '=');
    
    // Decode the base64 string
    const decoded = atob(padded);
    
    try {
      // Try to decode as UTF-8 content
      return new TextDecoder('utf-8').decode(
        new Uint8Array([...decoded].map(c => c.charCodeAt(0)))
      );
    } catch (e) {
      // Fallback to basic ASCII decoding if UTF-8 fails
      return decoded;
    }
  } catch (error) {
    console.error('Error decoding Gmail content:', error);
    return '';
  }
}

/**
 * Ensures HTML content has proper structure
 * @param html The HTML content to improve
 * @returns Properly structured HTML
 */
export function ensureProperHtmlStructure(html) {
  // If it doesn't have proper HTML structure, add it
  if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
${html}
</body>
</html>`;
  }
  
  // Add charset meta tag if missing
  if (!html.includes('<meta charset')) {
    return html.replace('<head>', '<head>\n<meta charset="utf-8">');
  }
  
  return html;
}

/**
 * Removes tracking pixels, scripts, and other tracking elements from HTML
 * @param html The HTML content to clean
 * @returns Cleaned HTML without tracking elements
 */
export function removeTrackingElements(html) {
  if (!html) return html;
  
  try {
    // Simple regex-based removal of common tracking elements
    // Remove tracking pixels (1x1 images, 0x0 images, etc.)
    let cleaned = html.replace(/<img[^>]*(?:height=(["'])(?:0|1)\\1[^>]*width=(["'])(?:0|1)\\2|width=(["'])(?:0|1)\\3[^>]*height=(["'])(?:0|1)\\4)[^>]*>/gi, '');
    
    // Remove tracking scripts from common analytics and tracking providers
    cleaned = cleaned.replace(/<script[^>]*(?:google-analytics\.com|googletagmanager\.com|analytics|tracking|pixel)[^>]*>[\s\S]*?<\/script>/gi, '');
    
    return cleaned;
  } catch (error) {
    console.error('Error removing tracking elements:', error);
    return html; // Return original if cleaning fails
  }
}
