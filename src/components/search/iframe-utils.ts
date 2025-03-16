
/**
 * Utilities for handling iframe content in newsletter previews
 */

/**
 * Generates formatted HTML content for the newsletter iframe
 * 
 * @param content The raw HTML content
 * @param isMobile Whether the display is for mobile
 * @returns Properly formatted HTML with styles for display
 */
export const getIframeContent = (content: string | null, isMobile: boolean = false): string => {
  if (!content) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>No content available</p></body></html>`;
  }
  
  // Replace http with https for security
  let secureContent = content.replace(/http:\/\//g, 'https://');
  
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; frame-src 'none';">
        <style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            width: 100%;
            background-color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          body {
            padding: 0 !important;
            margin: 0 auto !important;
            box-sizing: border-box;
            min-height: 100% !important;
            max-width: 100%;
            text-align: center;
          }
          a {
            pointer-events: none;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          * {
            max-width: 100%;
            box-sizing: border-box;
          }
          
          /* Center common newsletter container elements */
          .wrapper, .container, [class*="container"], [class*="wrapper"], 
          .email-body, .email-content, .main, .content {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
          
          /* Preserve table layouts which are critical for email newsletters */
          table, tr, td, th {
            border-collapse: collapse;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          
          /* Make sure email-specific styles often used in newsletters are preserved */
          .ReadMsgBody, .ExternalClass {
            width: 100%;
          }
          
          /* Center main elements directly inside body */
          body > table, 
          body > div {
            margin-left: auto !important;
            margin-right: auto !important;
            float: none !important;
          }
        </style>
      </head>
      <body>
        <div style="width:100%; max-width:600px; margin:0 auto; text-align:center;">
          ${secureContent}
        </div>
      </body>
    </html>`;
};

/**
 * Apply centering to elements in the document that might cause layout issues
 * This version preserves original layout while fixing centering issues
 * 
 * @param doc The document to apply centering to
 */
export const forceCentering = (doc: Document): void => {
  try {
    // Center main containers
    const containers = doc.querySelectorAll('body > table, body > div, .container, .wrapper, [class*="container"], [class*="wrapper"], .email-body, .email-content');
    containers.forEach(el => {
      const element = el as HTMLElement;
      if (element) {
        element.style.setProperty('margin-left', 'auto', 'important');
        element.style.setProperty('margin-right', 'auto', 'important');
        element.style.setProperty('float', 'none', 'important');
        
        // For tables, also set the align property which is common in email templates
        if (element instanceof HTMLTableElement) {
          element.setAttribute('align', 'center');
        }
      }
    });
    
    // Center tables that are direct children of body
    const tables = doc.querySelectorAll('body > table, .container > table, .wrapper > table');
    tables.forEach(table => {
      if (table instanceof HTMLTableElement) {
        table.setAttribute('align', 'center');
        table.style.setProperty('margin-left', 'auto', 'important');
        table.style.setProperty('margin-right', 'auto', 'important');
      }
    });
    
    // Set body to center content
    if (doc.body) {
      doc.body.style.setProperty('text-align', 'center', 'important');
      doc.body.style.setProperty('margin', '0 auto', 'important');
      doc.body.style.setProperty('display', 'flex', 'important');
      doc.body.style.setProperty('flex-direction', 'column', 'important');
      doc.body.style.setProperty('align-items', 'center', 'important');
      doc.body.style.setProperty('justify-content', 'flex-start', 'important');
    }
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};
