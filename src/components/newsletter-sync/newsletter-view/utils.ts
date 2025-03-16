
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
            overflow-x: hidden;
          }
          
          body {
            padding: 20px;
            box-sizing: border-box;
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
            max-width: 650px !important;
            margin: 0 auto;
            table-layout: fixed;
          }
          
          table td, table th {
            padding: 8px;
            word-wrap: break-word;
          }
          
          /* Keep layout tables working properly */
          table[data-preserved="true"], 
          td[data-preserved="true"], 
          th[data-preserved="true"] {
            width: auto !important;
            table-layout: auto !important;
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
          
          /* Force all backgrounds to white */
          [style*="background-color"],
          [style*="background:"] {
            background-color: #ffffff !important;
            background: #ffffff !important;
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
          .bodyTable, .bodyCell, .templateContainer, .templateColumn {
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
          
          /* Preserve email layouts that use tables for structure */
          .email-container, .wrapper, .container {
            width: 100% !important;
            max-width: 650px !important;
            margin: 0 auto !important;
          }
          
          /* Make mobile-friendly */
          @media screen and (max-width: 600px) {
            table {
              width: 100% !important;
            }
            
            td {
              display: block !important;
              width: 100% !important;
            }
            
            img {
              height: auto !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="error-overlay">
          <p>Some content in this newsletter could not be displayed properly due to security restrictions.</p>
        </div>
        <div class="email-container">
          ${sanitizedContent}
        </div>
      </body>
    </html>`;
}
