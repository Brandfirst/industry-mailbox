
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
            text-align: center !important;
          }
          body {
            padding: 0 !important;
            margin: 0 auto !important;
            box-sizing: border-box;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100% !important;
            position: relative !important;
            left: 0 !important;
            right: 0 !important;
          }
          a {
            pointer-events: none;
          }
          img {
            max-width: 100%;
            height: auto;
            display: inline-block;
            margin: 0 auto !important;
          }
          table {
            max-width: 100% !important;
            margin: 0 auto !important;
            float: none !important;
            display: table !important;
            width: auto !important;
            text-align: center !important;
            position: relative !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          * {
            max-width: 100%;
            box-sizing: border-box;
            margin-left: auto !important;
            margin-right: auto !important;
            text-align: center !important;
          }
          /* Fixed content centering - start from top without transform scaling */
          body > * {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            float: none !important;
            position: relative !important;
            left: 0 !important;
            right: 0 !important;
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
            position: static !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          /* Fix absolute positioning */
          [style*="position: absolute"], [style*="position:absolute"] {
            position: static !important;
            left: auto !important;
            right: auto !important;
            margin: 0 auto !important;
          }
        </style>
      </head>
      <body>
        <div style="width:100%; max-width:100%; margin:0 auto; display:flex; flex-direction:column; align-items:center;">
          ${secureContent}
        </div>
      </body>
    </html>`;
};

/**
 * Apply forced centering to all elements in the document
 * 
 * @param doc The document to apply centering to
 */
export const forceCentering = (doc: Document): void => {
  // Apply to all elements
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    
    // Override any margins or alignment
    element.style.setProperty('margin-left', 'auto', 'important');
    element.style.setProperty('margin-right', 'auto', 'important');
    element.style.setProperty('text-align', 'center', 'important');
    
    // Override floats
    if (window.getComputedStyle(element).getPropertyValue('float') !== 'none') {
      element.style.setProperty('float', 'none', 'important');
    }
    
    // Fix absolute positioned elements
    if (window.getComputedStyle(element).getPropertyValue('position') === 'absolute') {
      element.style.setProperty('position', 'static', 'important');
      element.style.setProperty('left', 'auto', 'important');
      element.style.setProperty('right', 'auto', 'important');
    }
    
    // For left-aligned elements specifically
    if (window.getComputedStyle(element).getPropertyValue('text-align') === 'left') {
      element.style.setProperty('text-align', 'center', 'important');
    }
  });
  
  // Special handling for tables which often cause alignment issues
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    const tableEl = table as HTMLTableElement;
    tableEl.style.setProperty('margin-left', 'auto', 'important');
    tableEl.style.setProperty('margin-right', 'auto', 'important');
    tableEl.style.setProperty('float', 'none', 'important');
    tableEl.style.setProperty('position', 'relative', 'important');
    tableEl.style.setProperty('left', '50%', 'important');
    tableEl.style.setProperty('transform', 'translateX(-50%)', 'important');
    tableEl.style.setProperty('width', 'auto', 'important');
    tableEl.style.setProperty('max-width', '100%', 'important');
  });

  // Set body styles for better centering
  doc.body.style.setProperty('margin', '0 auto', 'important');
  doc.body.style.setProperty('padding', '0', 'important');
  doc.body.style.setProperty('text-align', 'center', 'important');
  doc.body.style.setProperty('display', 'flex', 'important');
  doc.body.style.setProperty('flex-direction', 'column', 'important');
  doc.body.style.setProperty('align-items', 'center', 'important');
  doc.body.style.setProperty('justify-content', 'flex-start', 'important');
  doc.body.style.setProperty('width', '100%', 'important');
  doc.body.style.setProperty('max-width', '100%', 'important');
  doc.body.style.setProperty('position', 'relative', 'important');
  doc.body.style.setProperty('left', '0', 'important');
  doc.body.style.setProperty('right', '0', 'important');
  
  // Wrap all immediate children of body in a centered container if not already
  if (doc.body.children.length > 0 && !doc.querySelector('body > div[style*="width:100%"]')) {
    const wrapper = doc.createElement('div');
    wrapper.style.cssText = 'width:100%; max-width:100%; margin:0 auto; display:flex; flex-direction:column; align-items:center;';
    
    // Move all body children into this wrapper
    while (doc.body.firstChild) {
      wrapper.appendChild(doc.body.firstChild);
    }
    
    // Add wrapper back to body
    doc.body.appendChild(wrapper);
  }
};
