
import { sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

/**
 * Generates the HTML content for the iframe
 * @param content The raw newsletter content
 * @returns Formatted HTML content with proper styling
 */
export function generateIframeContent(content: string | null): string {
  if (!content) return '';
  
  // Sanitize the content first
  const sanitizedContent = sanitizeNewsletterContent(content);
  
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Reset and base styles */
          html, body {
            margin: 0;
            padding: 0;
            background-color: #FFFFFF;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            width: 100%;
            height: 100%;
          }
          
          body {
            padding: 20px;
            overflow-x: hidden;
          }
          
          /* Ensure all content is properly visible */
          * {
            max-width: 100%;
            box-sizing: border-box;
          }
          
          /* Force text to be visible */
          p, h1, h2, h3, h4, h5, h6, span, div, li, a, table, tr, td, th {
            color: #000000 !important; 
          }
          
          /* Ensure images display properly */
          img {
            max-width: 100%;
            height: auto;
            display: inline-block;
          }
          
          /* Handle tables - common in emails */
          table {
            border-collapse: collapse;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          table td, table th {
            padding: 8px;
          }
          
          /* Preserve table layouts - important for email formatting */
          table[width], td[width] {
            width: auto !important;
            max-width: 100% !important;
          }
          
          /* Override dark theme backgrounds */
          [style*="background-color: rgb(0, 0, 0)"],
          [style*="background-color: black"],
          [style*="background-color: #000"],
          [style*="background: black"],
          [style*="background: #000"] {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          
          /* Make links visible */
          a {
            color: #0066cc !important;
            text-decoration: underline;
          }
          
          /* Error message styling */
          .error-overlay {
            display: none;
            padding: 10px;
            margin: 10px 0;
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            color: #856404;
          }
          
          .has-error .error-overlay {
            display: block;
          }
          
          /* Fix for common newsletter layout issues */
          .bodyTable, .bodyCell {
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
        </style>
      </head>
      <body>
        <div class="error-overlay">
          <p>Some content in this newsletter could not be displayed properly due to security restrictions.</p>
        </div>
        ${sanitizedContent}
      </body>
    </html>`;
}
