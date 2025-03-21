
/**
 * Utility for cleaning up HTML content before displaying in iframes
 * to prevent CORS issues with external resources
 */
import { debugLog } from './debugUtils';
import { removeTrackingPixels } from './trackingFilter';

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
  debugLog('NORDIC CHARACTERS BEFORE SANITIZATION:', nordicChars || 'None found');
  
  // Apply our comprehensive tracking removal first to eliminate problem elements
  htmlContent = removeTrackingPixels(htmlContent);
  
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
  
  // Remove event handlers that might try to execute script
  htmlContent = htmlContent.replace(
    /\s(on\w+)="[^"]*"/gi,
    ' data-removed-$1="blocked-for-security"'
  );
  
  // Preserve table layout properties which are critical for email formatting
  htmlContent = htmlContent.replace(
    /<table([^>]*)>/gi,
    (match, attributes) => {
      // Preserve width, cellpadding, cellspacing attributes
      return `<table${attributes} data-preserved="true">`;
    }
  );
  
  // Preserve cell dimensions which are critical for email formatting
  htmlContent = htmlContent.replace(
    /<(td|th)([^>]*)>/gi,
    (match, tag, attributes) => {
      // Preserve width, colspan, rowspan attributes
      return `<${tag}${attributes} data-preserved="true">`;
    }
  );
  
  // Fix tables with fixed layouts
  htmlContent = htmlContent.replace(
    /<table([^>]*)style="([^"]*)"/gi,
    (match, attributes, styles) => {
      // Preserve table styles but make sure layout is fixed
      const enhancedStyles = styles.includes('table-layout') 
        ? styles 
        : styles + '; table-layout: fixed;';
      return `<table${attributes}style="${enhancedStyles}" data-preserved="true"`;
    }
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
  debugLog('NORDIC CHARACTERS AFTER SANITIZATION:', nordicCharsAfter || 'None found');
  
  // Log that we've sanitized the content
  debugLog('Newsletter content sanitized to prevent CORS issues with fonts, UTF-8 encoding preserved');
  
  return htmlContent;
};
