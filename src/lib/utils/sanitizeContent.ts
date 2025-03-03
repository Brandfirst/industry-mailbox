
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
  
  // Log that we've sanitized the content
  console.log('Newsletter content sanitized to prevent CORS issues with fonts');
  
  return htmlContent;
};

/**
 * Adds system font fallbacks to ensure text is still displayed properly
 * even when external fonts can't be loaded
 */
export const getSystemFontCSS = (): string => {
  return `
    /* System font fallbacks */
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
