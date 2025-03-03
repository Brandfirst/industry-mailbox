
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
    
    /* Preserve special characters styling */
    .preserve-nordic {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
    
    /* Make sure UTF-8 Nordic characters display properly */
    [data-has-nordic-chars] {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
    }
    
    /* Override any external font to ensure everything renders */
    @font-face {
      font-family: 'ABCFavorit-Medium';
      src: local('-apple-system');
      font-weight: normal;
      font-style: normal;
    }
    
    @font-face {
      font-family: 'ABCFavorit-Bold';
      src: local('-apple-system');
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
  const content = String(text);
  
  try {
    // Use TextEncoder/TextDecoder for proper UTF-8 handling
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    // Encode and then decode to normalize UTF-8
    const bytes = encoder.encode(content);
    const normalizedText = decoder.decode(bytes);
    
    return normalizedText;
  } catch (error) {
    console.error('Error ensuring UTF-8 encoding:', error);
    return content; // Return original if encoding fails
  }
};
