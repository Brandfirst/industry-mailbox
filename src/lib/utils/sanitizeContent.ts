
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      margin: 0;
      padding: 10px;
    }
    
    /* Enhanced Nordic character support */
    @font-face {
      font-family: 'SystemNordic';
      src: local('Arial Unicode MS'), local('Arial'), local('Helvetica');
      unicode-range: U+00C5, U+00C6, U+00D8, U+00E5, U+00E6, U+00F8; /* ÅÆØåæø */
    }
    
    /* Preserve special characters styling */
    .preserve-nordic, [data-has-nordic-chars] * {
      font-family: 'SystemNordic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
    
    /* Make sure UTF-8 Nordic characters display properly */
    [data-has-nordic-chars] {
      font-family: 'SystemNordic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
    
    /* Override any external font to ensure everything renders */
    @font-face {
      font-family: 'ABCFavorit-Medium';
      src: local('SystemNordic'), local('-apple-system');
      font-weight: normal;
      font-style: normal;
    }
    
    @font-face {
      font-family: 'ABCFavorit-Bold';
      src: local('SystemNordic'), local('-apple-system');
      font-weight: bold;
      font-style: normal;
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
    // Check if we need to decode/fix a potential encoding issue
    if (!/[ØÆÅøæå]/.test(content) && /[\u00c3][\u00b8\u00a6\u0085\u00a5\u00b6\u00f8]/.test(content)) {
      // This might be double-encoded UTF-8, try to fix it
      console.log('Detected possible double-encoded UTF-8, attempting to fix...');
      
      // Try to decode as if it were Latin-1 (ISO-8859-1) first
      const decoder = new TextDecoder('iso-8859-1');
      const encoder = new TextEncoder();
      const bytes = encoder.encode(content);
      content = decoder.decode(bytes);
      
      console.log('After ISO-8859-1 decoding attempt:', content.substring(0, 100));
    }
    
    // Handle potential UTF-8 sequence issues
    content = content
      // Fix for Æ - might appear as Ã† in some encodings
      .replace(/Ã†/g, 'Æ')
      .replace(/Ã¦/g, 'æ')
      // Fix for Ø - might appear as Ã˜ in some encodings
      .replace(/Ã˜/g, 'Ø')
      .replace(/Ã¸/g, 'ø')
      // Fix for Å - might appear as Ã… in some encodings
      .replace(/Ã…/g, 'Å')
      .replace(/Ã¥/g, 'å');
      
    // Now use TextEncoder/TextDecoder for proper UTF-8 handling
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    // Encode and then decode to normalize UTF-8
    const bytes = encoder.encode(content);
    const normalizedText = decoder.decode(bytes);
    
    // Check if we found any Nordic characters after fixing
    const nordicChars = (normalizedText.match(/[ØÆÅøæå]/g) || []).join('');
    console.log('NORDIC CHARACTERS AFTER UTF-8 NORMALIZATION:', nordicChars || 'None found');
    
    return normalizedText;
  } catch (error) {
    console.error('Error ensuring UTF-8 encoding:', error);
    return content; // Return original if encoding fails
  }
};
