/**
 * Utility for cleaning up HTML content before displaying in iframes
 * to prevent CORS issues with external resources
 */

/**
 * Removes external font imports or replaces them with system fonts
 * to prevent CORS errors when displaying newsletter content
 */
export const sanitizeNewsletterContent = (content: string | null): string => {
  if (!content) return '';
  
  // Convert content to string if it's not already
  let htmlContent = String(content);
  
  // Check for Nordic characters before processing
  const nordicChars = (htmlContent.match(/[ØÆÅøæå]/g) || []).join('');
  console.log('NORDIC CHARACTERS BEFORE SANITIZATION:', nordicChars || 'None found');
  
  // Replace problematic @font-face declarations
  htmlContent = htmlContent.replace(
    /@font-face\s*{[^}]*}/gi,
    '/* External fonts removed to prevent CORS issues */'
  );

  // Replace font imports in style tags
  htmlContent = htmlContent.replace(
    /<link[^>]*fonts[^>]*>/gi, 
    '<!-- External font links removed to prevent CORS issues -->'
  );
  
  // Remove all direct font references in styles to prevent CORS issues
  htmlContent = htmlContent.replace(
    /url\(['"]?https?:\/\/[^)]*\.(woff2?|ttf|otf|eot)['"]?\)/gi,
    "url('')"
  );
  
  // Replace any references to fonts in inline styles
  htmlContent = htmlContent.replace(
    /font-family:[^;]*(google|googleapis|cloudfront|storage\.googleapis)/gi,
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  );
  
  // Remove script tags to prevent sandbox warnings
  htmlContent = htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
    '<!-- Scripts removed for security -->'
  );
  
  // Ensure content has proper UTF-8 meta tags if it's HTML
  if (htmlContent.includes('<html') && !htmlContent.includes('<meta charset="utf-8">')) {
    if (htmlContent.includes('<head')) {
      // Add charset meta to head if not present
      htmlContent = htmlContent.replace(
        /<head[^>]*>/i,
        '$&<meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
      );
    } else if (htmlContent.includes('<html')) {
      // Add head with charset meta if no head exists
      htmlContent = htmlContent.replace(
        /<html[^>]*>/i,
        '$&<head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>'
      );
    }
  }
  
  // Check for Nordic characters after processing
  const nordicCharsAfter = (htmlContent.match(/[ØÆÅøæå]/g) || []).join('');
  console.log('NORDIC CHARACTERS AFTER SANITIZATION:', nordicCharsAfter || 'None found');
  
  // Log that we've sanitized the content
  console.log('Newsletter content sanitized to prevent CORS issues with fonts, UTF-8 encoding preserved');
  
  return htmlContent;
};

/**
 * Adds system font fallbacks to ensure text is still displayed properly
 * even when external fonts can't be loaded
 */
export const getSystemFontCSS = (): string => {
  return `
    /* System font fallbacks with UTF-8 character support */
    * {
      font-family: inherit;
    }
    
    body {
      margin: 0;
      padding: 10px;
    }
    
    /* Enhanced Nordic character support - keep original font */
    @font-face {
      font-family: 'SystemNordic';
      src: local('Arial Unicode MS'), local('Arial'), local('Helvetica');
      unicode-range: U+00C5, U+00C6, U+00D8, U+00E5, U+00E6, U+00F8; /* ÅÆØåæø */
    }
    
    /* Instead of forcing a specific font, we only apply fallbacks */
    .preserve-nordic, [data-has-nordic-chars] * {
      font-family: inherit, 'SystemNordic', Arial Unicode MS, Arial, sans-serif;
    }
    
    /* Make sure UTF-8 Nordic characters display properly without changing font */
    [data-has-nordic-chars] {
      font-family: inherit, 'SystemNordic', Arial Unicode MS, Arial, sans-serif;
    }
  `;
};

/**
 * Ensures that a string is properly UTF-8 encoded
 * Particularly useful for Nordic characters like ØÆÅøæå
 */
export const ensureUtf8Encoding = (text: string | null): string => {
  if (!text) return '';
  
  // Convert to string if it's not already
  let content = String(text);
  
  try {
    // Check for double-encoded UTF-8 sequences - these are common when data is 
    // double-encoded or when Latin-1 is interpreted as UTF-8
    if (content.includes('Ã¸') || content.includes('Ã¦') || content.includes('Ã…') || 
        content.includes('Ã˜') || content.includes('Ã†') || content.includes('Ã¥')) {
      console.log('Detected possible double-encoded UTF-8, attempting to fix...');
      
      // Replace all known problematic sequences directly
      content = content
        // Fix for ø (small o with stroke)
        .replace(/Ã¸/g, 'ø')
        // Fix for æ (small ae)
        .replace(/Ã¦/g, 'æ')
        // Fix for å (small a with ring)
        .replace(/Ã¥/g, 'å')
        // Fix for Ø (capital O with stroke)
        .replace(/Ã˜/g, 'Ø')
        // Fix for Æ (capital AE)
        .replace(/Ã†/g, 'Æ')
        // Fix for Å (capital A with ring)
        .replace(/Ã…/g, 'Å');
      
      // If we still don't detect Nordic characters after direct replacement,
      // try a more aggressive approach with TextDecoder
      if (!/[ØÆÅøæå]/.test(content)) {
        try {
          // Try decoding as ISO-8859-1, which often works for Nordic characters
          const decoder = new TextDecoder('iso-8859-1');
          const encoder = new TextEncoder();
          const bytes = encoder.encode(content);
          content = decoder.decode(bytes);
          
          console.log('After ISO-8859-1 decoding attempt:', content.substring(0, 100));
        } catch (e) {
          console.error('Error using TextDecoder with ISO-8859-1:', e);
        }
      }
    }
    
    // Additional manual replacements for common encoding issues with Nordic chars
    // Sometimes they appear with HTML entities or in other forms
    content = content
      // HTML entities for Nordic characters
      .replace(/&oslash;/g, 'ø')
      .replace(/&aelig;/g, 'æ')
      .replace(/&aring;/g, 'å')
      .replace(/&Oslash;/g, 'Ø')
      .replace(/&AElig;/g, 'Æ')
      .replace(/&Aring;/g, 'Å')
      // Numeric HTML entities
      .replace(/&#248;/g, 'ø')
      .replace(/&#230;/g, 'æ')
      .replace(/&#229;/g, 'å')
      .replace(/&#216;/g, 'Ø')
      .replace(/&#198;/g, 'Æ')
      .replace(/&#197;/g, 'Å');
    
    // Check for any remaining encoding anomalies and log them
    const doubleEncodedPattern = /Ã[…†˜¦ø¸]/g;
    const remainingDoubleEncoded = content.match(doubleEncodedPattern);
    if (remainingDoubleEncoded && remainingDoubleEncoded.length > 0) {
      console.log('Remaining potentially double-encoded sequences:', 
                  [...new Set(remainingDoubleEncoded)].join(', '));
    }
    
    // Check if we found any Nordic characters after fixing
    const nordicChars = (content.match(/[ØÆÅøæå]/g) || []).join('');
    console.log('NORDIC CHARACTERS AFTER UTF-8 NORMALIZATION:', nordicChars || 'None found');
    
    return content;
  } catch (error) {
    console.error('Error ensuring UTF-8 encoding:', error);
    return content; // Return original if encoding fails
  }
};
