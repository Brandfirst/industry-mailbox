
import { removeTrackingPixels, shouldSuppressError, getSecureCSP } from './content-sanitization/trackingFilter';

/**
 * Comprehensive content sanitization for newsletter content display
 */
export const prepareNewsletterContentForDisplay = (content: string | null): string => {
  if (!content) return '';
  
  let cleanContent = content;
  
  // Ensure proper UTF-8 encoding
  cleanContent = cleanContent
    // Replace any problematic character sequences
    .replace(/Ã¸/g, 'ø')
    .replace(/Ã¥/g, 'å')
    .replace(/Ã¦/g, 'æ')
    .replace(/Ã˜/g, 'Ø')
    .replace(/Ã…/g, 'Å')
    .replace(/Ã†/g, 'Æ');
  
  // Apply our comprehensive tracking pixel removal
  cleanContent = removeTrackingPixels(cleanContent);
  
  // Force HTTPS for all resources
  cleanContent = cleanContent.replace(/http:\/\//g, 'https://');
  
  // Remove scripts for security
  cleanContent = cleanContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');
  
  // Remove external font imports to prevent CORS issues
  cleanContent = cleanContent.replace(
    /@font-face\s*{[^}]*}/gi,
    '/* External fonts removed to prevent CORS issues */'
  );
  
  // Remove font link tags
  cleanContent = cleanContent.replace(
    /<link[^>]*fonts[^>]*>/gi, 
    '<!-- External font links removed -->'
  );
  
  // Remove all direct font references in styles
  cleanContent = cleanContent.replace(
    /url\(['"]?https?:\/\/[^)]*\.(woff2?|ttf|otf|eot)['"]?\)/gi,
    "url('')"
  );
  
  // Make sure styles don't overflow container
  cleanContent = cleanContent.replace(
    /position:\s*fixed/gi,
    'position: relative'
  );
  
  return cleanContent;
};

/**
 * Create a secure HTML wrapper for newsletter content in iframes
 */
export const createSecureNewsletterHtml = (content: string, title?: string): string => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="${getSecureCSP()}">
        <title>${title || 'Newsletter Content'}</title>
        <style>
          /* System fonts to prevent CORS issues */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            padding: 20px;
            margin: 0;
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
          // Advanced error handling
          window.addEventListener('error', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if this is a security-related error that should be suppressed
            const errorMsg = e.message || '';
            const isTrackingError = ${shouldSuppressError.toString()}(errorMsg);
            
            if (!isTrackingError) {
              document.body.classList.add('has-error');
            }
            
            return true; // Prevents the error from bubbling up
          }, true);
          
          // Suppress console errors too
          const originalConsoleError = console.error;
          console.error = function() {
            const args = Array.from(arguments);
            const errorString = args.join(' ');
            
            // Only pass through non-tracking errors
            if (!${shouldSuppressError.toString()}(errorString)) {
              originalConsoleError.apply(console, args);
            }
          };
        </script>
      </head>
      <body>
        <div class="error-overlay">
          <p>Some content in this newsletter could not be displayed properly due to security restrictions.</p>
        </div>
        ${content}
      </body>
    </html>`;
};
