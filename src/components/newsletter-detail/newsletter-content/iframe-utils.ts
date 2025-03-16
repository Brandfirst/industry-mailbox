
import { debugLog } from "@/lib/utils/content-sanitization";

/**
 * Creates properly formatted HTML content for the iframe
 */
export const getFormattedHtmlContent = (content: string | null) => {
  if (!content) return '';
  
  // Minimal sanitization approach - only convert http to https for security
  let secureContent = content.replace(/http:\/\//g, 'https://');
  
  // Create a simple HTML structure with security headers to block scripts
  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Security-Policy" content="script-src 'none'; frame-src 'none';">
              <style>
                body {
                  padding: 20px;
                  line-height: 1.6;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
                    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                }
                img { max-width: 100%; height: auto; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>
              ${secureContent}
            </body>
          </html>`;
};
