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
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          body {
            padding: 1rem !important; 
            margin: 0 auto !important;
            width: auto !important;
            max-width: 100% !important;
            min-height: 100% !important;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          /* Preserve the pointer-events none for links */
          a {
            pointer-events: none;
          }
          
          /* Ensure images don't overflow their containers */
          img {
            max-width: 100%;
            height: auto;
          }
          
          /* Create a centered container for newsletter content */
          .newsletter-wrapper {
            width: auto !important;
            max-width: 100% !important;
            display: block;
            margin: 0 auto !important;
            overflow-x: visible;
            text-align: center;
          }
          
          /* Make sure tables don't overflow */
          table {
            max-width: 100%;
            margin-left: auto !important;
            margin-right: auto !important;
            width: auto !important; 
            table-layout: auto !important;
          }
          
          /* Handle nested tables often used in newsletters */
          table table {
            width: 100% !important;
          }
          
          /* Center common newsletter container elements without transforming them */
          .wrapper, .container, [class*="container"], [class*="wrapper"], 
          .email-body, .email-content, .main, .content {
            margin-left: auto !important;
            margin-right: auto !important;
            width: auto !important;
            max-width: 100% !important;
            float: none !important;
          }
          
          /* Preserve table layouts which are critical for email newsletters */
          table, tr, td, th {
            border-collapse: collapse;
          }
          
          /* Fix width of elements setting explicit widths */
          [width] {
            max-width: 100% !important;
          }
          
          /* Make sure email-specific styles often used in newsletters are preserved */
          .ReadMsgBody, .ExternalClass {
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="newsletter-wrapper">
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
    // Set body to center content
    if (doc.body) {
      doc.body.style.setProperty('margin', '0 auto', 'important');
      doc.body.style.setProperty('text-align', 'center', 'important');
      doc.body.style.setProperty('padding', '1rem', 'important');
      doc.body.style.setProperty('width', 'auto', 'important');
      doc.body.style.setProperty('max-width', '100%', 'important');
      doc.body.style.setProperty('box-sizing', 'border-box', 'important');
      doc.body.style.setProperty('overflow-x', 'visible', 'important');
    }

    // Center the main newsletter wrapper
    const newsletterWrapper = doc.querySelector('.newsletter-wrapper');
    if (newsletterWrapper instanceof HTMLElement) {
      newsletterWrapper.style.setProperty('margin', '0 auto', 'important');
      newsletterWrapper.style.setProperty('width', 'auto', 'important');
      newsletterWrapper.style.setProperty('max-width', '100%', 'important');
      newsletterWrapper.style.setProperty('overflow-x', 'visible', 'important');
      newsletterWrapper.style.setProperty('display', 'block', 'important');
      newsletterWrapper.style.setProperty('text-align', 'center', 'important');
    }

    // Center main containers
    const containers = doc.querySelectorAll('.container, .wrapper, [class*="container"], [class*="wrapper"], .email-body, .email-content, .main, .content');
    containers.forEach(el => {
      const element = el as HTMLElement;
      if (element) {
        element.style.setProperty('margin-left', 'auto', 'important');
        element.style.setProperty('margin-right', 'auto', 'important');
        element.style.setProperty('float', 'none', 'important');
        element.style.setProperty('width', 'auto', 'important');
        element.style.setProperty('max-width', '100%', 'important');
      }
    });
    
    // Center tables (very common in email templates)
    const tables = doc.querySelectorAll('table');
    tables.forEach(table => {
      if (table instanceof HTMLTableElement) {
        table.setAttribute('align', 'center');
        table.style.setProperty('margin-left', 'auto', 'important');
        table.style.setProperty('margin-right', 'auto', 'important');
        table.style.setProperty('float', 'none', 'important');
        table.style.setProperty('max-width', '100%', 'important');
        table.style.setProperty('width', 'auto', 'important');
        
        // Handle tables with fixed widths
        const width = table.getAttribute('width');
        if (width) {
          const numWidth = parseInt(width, 10);
          if (!isNaN(numWidth) && numWidth > 0) {
            // Set a max-width instead of a fixed width to prevent overflow
            table.style.setProperty('max-width', `${numWidth}px`, 'important');
            table.style.setProperty('width', 'auto', 'important');
          }
        }
      }
    });
    
    // Handle fixed width elements
    const fixedWidthElements = doc.querySelectorAll('[width]');
    fixedWidthElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const width = el.getAttribute('width');
        if (width) {
          const numWidth = parseInt(width, 10);
          if (!isNaN(numWidth) && numWidth > 0) {
            el.style.setProperty('max-width', `${numWidth}px`, 'important');
            el.style.setProperty('width', 'auto', 'important');
          }
        }
      }
    });

    // Handle TD elements with width (common in email templates)
    const tdElements = doc.querySelectorAll('td[width], th[width]');
    tdElements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Keep the width attribute for layout but ensure it doesn't overflow
        el.style.setProperty('max-width', '100%', 'important');
      }
    });
    
    // Fix any absolutely positioned elements that might be causing issues
    const absoluteElements = doc.querySelectorAll('[style*="position: absolute"], [style*="position:absolute"]');
    absoluteElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('position', 'relative', 'important');
        el.style.setProperty('left', 'auto', 'important');
        el.style.setProperty('right', 'auto', 'important');
      }
    });
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};
