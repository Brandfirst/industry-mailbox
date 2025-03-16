
import { debugLog, getSystemFontCSS, ensureUtf8Encoding, sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

/**
 * Generate iframe content with proper encoding and sanitization
 */
export function generateIframeContent(content: string | null): string | null {
  if (!content) return null;

  // First ensure proper UTF-8 encoding
  const utf8Content = ensureUtf8Encoding(content);

  // Check for Nordic characters
  const nordicChars = (utf8Content.match(/[ØÆÅøæå]/g) || []).join('');
  debugLog('NORDIC CHARACTERS IN DIALOG BEFORE SANITIZE:', nordicChars || 'None found');

  // Sanitize content to prevent CORS issues
  let sanitizedContent = sanitizeNewsletterContent(utf8Content);

  // Replace http:// with https:// for security
  sanitizedContent = sanitizedContent.replace(/http:\/\//g, 'https://');

  // More aggressive tracking pixel and analytics removal
  sanitizedContent = sanitizedContent.replace(/<img[^>]*?src=['"]https?:\/\/([^'"]+)\.(?:mail|click|url|send|analytics|track|open|beacon|wf|ea|stat)[^'"]*['"][^>]*>/gi, '<!-- tracking pixel removed -->');

  // Remove any script tags to prevent sandbox warnings
  sanitizedContent = sanitizedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');

  // Remove problematic link tags that could cause certificate errors
  sanitizedContent = sanitizedContent.replace(/<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, '<!-- problematic link removed -->');

  // Add data attribute if has Nordic characters for special font handling
  const hasNordicAttribute = nordicChars ? 'data-has-nordic-chars="true"' : '';
  
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; script-src 'none'; img-src 'self' data: https:; connect-src 'none'; frame-src 'none';">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <style>
          ${getSystemFontCSS()}
          body {
            margin: 0;
            padding: 1rem;
            color: #333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #ffffff;
          }
          img { max-width: 100%; height: auto; }
          * { max-width: 100%; box-sizing: border-box; }
          
          /* Error message styling */
          .error-overlay {
            display: none;
            padding: 10px;
            margin: 10px 0;
            background-color: #f8f9fa;
            border-left: 4px solid #dc3545;
            color: #333;
          }
          .has-error .error-overlay {
            display: block;
          }
        </style>
        <script>
          // Suppress all errors to prevent console warnings
          window.addEventListener('error', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if this is a certificate error or tracking pixel
            const isTrackingError = e.message && (
              e.message.includes('certificate') || 
              e.message.includes('tracking') || 
              e.message.includes('analytics') ||
              e.message.includes('ERR_CERT') ||
              e.message.includes('net::')
            );
            
            if (!isTrackingError) {
              // Only show error for non-tracking issues
              document.body.classList.add('has-error');
            }
            
            return true; // Prevents the error from bubbling up
          }, true);
        </script>
      </head>
      <body ${hasNordicAttribute}>
        <div class="error-overlay">
          <p>Some content in this newsletter could not be displayed properly. This is usually due to security restrictions.</p>
        </div>
        ${sanitizedContent}
      </body>
    </html>`;
}
