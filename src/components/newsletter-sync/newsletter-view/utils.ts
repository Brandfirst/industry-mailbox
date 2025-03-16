
import { sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

/**
 * Generates the HTML content for the iframe
 * @param content The raw newsletter content
 * @returns Formatted HTML content with proper styling
 */
export function generateIframeContent(content: string | null): string {
  if (!content) return '';
  
  // Minimal sanitization approach - only convert http to https for security
  let cleanContent = content || '';
  cleanContent = cleanContent.replace(/http:\/\//g, 'https://');
  
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
          }
          img { max-width: 100%; height: auto; }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>
        ${cleanContent}
      </body>
    </html>`;
}
