
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
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  overflow-x: hidden;
                  text-align: center;
                  box-sizing: border-box;
                }
                body {
                  padding: 0;
                  line-height: 1.6;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
                    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }
                img { max-width: 100%; height: auto; }
                * { box-sizing: border-box; }
                
                /* Better centering and scaling */
                body > * {
                  max-width: 100% !important;
                  width: 100% !important;
                  margin: 0 auto !important;
                  float: none !important;
                  left: 0 !important;
                  right: 0 !important;
                  position: relative !important;
                  transform: scale(0.85);
                  transform-origin: center top;
                }
                
                table {
                  max-width: 100%;
                  margin: 0 auto !important;
                  float: none !important;
                  display: table !important;
                  position: relative !important;
                }
                
                /* Fix left alignment issues */
                [align="left"], [style*="text-align: left"] {
                  text-align: center !important;
                  margin: 0 auto !important;
                }
                
                td, th {
                  text-align: center !important;
                }
                
                /* Additional fixes for common elements */
                div, section, article, header, footer, main, p, h1, h2, h3, h4, h5, h6, span {
                  margin-left: auto !important;
                  margin-right: auto !important;
                  float: none !important;
                  text-align: center !important;
                  position: relative !important;
                  max-width: 100% !important;
                  width: 100% !important;
                }
                
                /* Override specific position properties */
                [style*="position: absolute"], [style*="position:absolute"] {
                  position: relative !important;
                  left: auto !important;
                  right: auto !important;
                  margin: 0 auto !important;
                }
              </style>
            </head>
            <body>
              ${secureContent}
            </body>
          </html>`;
};
