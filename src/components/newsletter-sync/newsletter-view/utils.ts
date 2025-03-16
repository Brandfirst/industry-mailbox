
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
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          img { max-width: 100%; height: auto; }
          * { box-sizing: border-box; }
          a { color: #3b82f6; text-decoration: none; }
          a:hover { text-decoration: underline; }
          h1, h2, h3, h4, h5, h6 { color: #111; }
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
