
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
          }
          body {
            padding: 0 !important;
            margin: 0 auto !important;
            box-sizing: border-box;
            min-height: 100% !important;
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
          
          /* Only fix absolute positioned elements that cause layout issues */
          [style*="position: absolute"], [style*="position:absolute"] {
            position: relative !important;
          }
          
          /* Preserve table layouts which are critical for email newsletters */
          table, tr, td, th {
            border-collapse: collapse;
            table-layout: auto;
          }
          
          /* Make sure email-specific styles often used in newsletters are preserved */
          .ReadMsgBody, .ExternalClass {
            width: 100%;
          }
          
          /* Handle margins that might cause the left gap */
          .wrapper, .container, [class*="container"], [class*="wrapper"] {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        </style>
      </head>
      <body>
        ${secureContent}
      </body>
    </html>`;
};

/**
 * Apply subtle centering to elements in the document that might cause left gap
 * This version preserves more of the original layout
 * 
 * @param doc The document to apply centering to
 */
export const forceCentering = (doc: Document): void => {
  try {
    // Only fix elements that are causing the left gap issue
    const wrappers = doc.querySelectorAll('.wrapper, .container, [class*="container"], [class*="wrapper"]');
    wrappers.forEach(el => {
      const element = el as HTMLElement;
      if (element) {
        // Only center if it's not already centered
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.marginLeft === '0px' || computedStyle.marginRight === '0px') {
          element.style.setProperty('margin-left', 'auto', 'important');
          element.style.setProperty('margin-right', 'auto', 'important');
        }
      }
    });
    
    // Fix body if it's causing issues
    if (doc.body) {
      const bodyStyle = window.getComputedStyle(doc.body);
      if (bodyStyle.margin === '0px' || bodyStyle.marginLeft === '0px') {
        doc.body.style.setProperty('margin', '0 auto', 'important');
      }
      
      // If body is too narrow, give it appropriate width
      if (parseInt(bodyStyle.width) < 100) {
        doc.body.style.setProperty('width', '100%', 'important');
      }
    }
    
    // Handle common tables that might be left-aligned but should be centered
    const tables = doc.querySelectorAll('table[width]');
    tables.forEach(table => {
      if (table instanceof HTMLTableElement) {
        const parent = table.parentElement;
        if (parent && parent !== doc.body) {
          // Only adjust if the parent is causing the left gap
          const parentStyle = window.getComputedStyle(parent);
          if (parentStyle.textAlign !== 'center') {
            parent.style.setProperty('text-align', 'center', 'important');
          }
        }
      }
    });
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};
