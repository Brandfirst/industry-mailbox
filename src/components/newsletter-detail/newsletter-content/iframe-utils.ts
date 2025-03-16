
import { debugLog } from "@/lib/utils/content-sanitization";
import { 
  sanitizeNewsletterContent, 
  getSystemFontCSS, 
  ensureUtf8Encoding 
} from "@/lib/utils/content-sanitization";

/**
 * Creates properly formatted HTML content for the iframe
 */
export const getFormattedHtmlContent = (content: string | null) => {
  if (!content) return '';
  
  debugLog('PREPARING CONTENT FOR IFRAME (first 100 chars):', content.substring(0, 100));
  
  // First ensure UTF-8 encoding with our enhanced function
  const utf8Content = ensureUtf8Encoding(content);
  
  // Check for Nordic characters before processing
  const nordicChars = (utf8Content.match(/[ØÆÅøæå]/g) || []).join('');
  debugLog('NORDIC CHARACTERS IN CONTENT COMPONENT BEFORE SANITIZE:', nordicChars || 'None found');
  
  // If no Nordic characters found, search for potential mis-encoded sequences
  if (!nordicChars) {
    const potentialDoubleEncoded = utf8Content.match(/Ã[…†˜¦ø¸]/g);
    if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
      debugLog('Potential double-encoded characters found:', potentialDoubleEncoded.join(', '));
    }
  }
  
  // Sanitize content to prevent CORS issues with fonts
  let sanitizedContent = sanitizeNewsletterContent(utf8Content);
  
  // Force HTTPS
  sanitizedContent = sanitizedContent.replace(/http:\/\//g, 'https://');
  
  // More aggressive tracking pixel and analytics removal
  sanitizedContent = sanitizedContent.replace(/<img[^>]*?src=['"]https?:\/\/([^'"]+)\.(?:mail|click|url|send|analytics|track|open|beacon|wf|ea|stat)[^'"]*['"][^>]*>/gi, '<!-- tracking pixel removed -->');
  
  // Remove any script tags
  sanitizedContent = sanitizedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');
  
  // Remove problematic link tags that could cause certificate errors
  sanitizedContent = sanitizedContent.replace(/<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, '<!-- problematic link removed -->');
  
  // Add data attribute if it has Nordic characters for special font handling
  const hasNordicAttribute = nordicChars ? 'data-has-nordic-chars="true"' : '';
  
  // Re-check for Nordic characters after sanitization
  const nordicCharsAfter = (sanitizedContent.match(/[ØÆÅøæå]/g) || []).join('');
  debugLog('NORDIC CHARACTERS IN CONTENT COMPONENT AFTER SANITIZE:', nordicCharsAfter || 'None found');
  
  // Ensure content has proper HTML structure with UTF-8 encoding
  // but preserve original styling
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; script-src 'none'; img-src 'self' data: https:; connect-src 'none'; frame-src 'none';">
              <style>
                ${getSystemFontCSS()}
                body {
                  padding: 20px;
                  line-height: 1.6;
                }
                img { max-width: 100%; height: auto; }
                * { box-sizing: border-box; }
                
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
                  
                  // Don't show error UI for tracking/analytics errors
                  const isTrackingError = e.message && (
                    e.message.includes('certificate') || 
                    e.message.includes('tracking') || 
                    e.message.includes('analytics') ||
                    e.message.includes('ERR_CERT') ||
                    e.message.includes('net::')
                  );
                  
                  if (!isTrackingError) {
                    // For serious errors, show the error message
                    document.body.classList.add('has-error');
                  }
                  
                  return true; // Prevents the error from bubbling up
                }, true);
              </script>
            </head>
            <body ${hasNordicAttribute}>
              <div class="error-overlay">
                <p>Some content in this newsletter could not be displayed properly. This is usually because of external resources that can't be loaded due to security restrictions.</p>
              </div>
              ${sanitizedContent}
            </body>
          </html>`;
};
