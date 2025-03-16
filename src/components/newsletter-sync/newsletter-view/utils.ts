
import { sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

/**
 * Generates the HTML content for the iframe
 * @param content The raw newsletter content
 * @returns Formatted HTML content with proper styling
 */
export function generateIframeContent(content: string | null): string {
  if (!content) return '';
  
  // Apply more comprehensive sanitization
  let cleanContent = sanitizeNewsletterContent(content);
  
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; frame-src 'none';">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }
          body {
            margin: 0 auto;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          img { max-width: 100%; height: auto; }
          * { box-sizing: border-box; }
          a { color: #3b82f6; text-decoration: none; }
          a:hover { text-decoration: underline; }
          h1, h2, h3, h4, h5, h6 { color: #111; }
          
          /* Improved centering and scaling */
          body > * {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            transform: scale(0.85);
            transform-origin: top center;
          }
          
          table {
            max-width: 100%;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        ${cleanContent}
      </body>
    </html>`;
}

/**
 * Creates a URL for viewing the full newsletter
 * @param newsletterId The ID of the newsletter
 * @returns URL string for the newsletter
 */
export function getNewsletterUrl(newsletterId: number | string): string {
  return `/newsletter/${newsletterId}`;
}
