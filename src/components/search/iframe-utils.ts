
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
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background-color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow-x: hidden;
            overflow-y: hidden;
            box-sizing: border-box;
            text-align: center;
          }
          body {
            padding: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
          }
          a {
            pointer-events: none;
          }
          img {
            max-width: 100%;
            height: auto;
            display: inline-block;
          }
          table {
            max-width: 100%;
            margin: 0 auto !important;
            float: none !important;
            display: table !important;
            width: 100% !important;
          }
          * {
            max-width: 100%;
            box-sizing: border-box;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          /* Fixed content centering and scaling */
          body > * {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            float: none !important;
            transform: scale(${isMobile ? '0.6' : '0.7'});
            transform-origin: center top;
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
            position: relative !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          /* Fix absolute positioning */
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
    element.style.marginLeft = 'auto';
    element.style.marginRight = 'auto';
    
    // If element has float, override it
    if (window.getComputedStyle(element).float !== 'none') {
      element.style.float = 'none';
    }
    
    // Fix absolute positioned elements
    if (window.getComputedStyle(element).position === 'absolute') {
      element.style.position = 'relative';
      element.style.left = 'auto';
      element.style.right = 'auto';
    }
  });
  
  // Additional specific fixes for container elements
  const containers = doc.querySelectorAll('div, section, table, article, header, footer, main');
  containers.forEach(container => {
    const containerEl = container as HTMLElement;
    containerEl.style.width = '100%';
    containerEl.style.maxWidth = '100%';
    containerEl.style.textAlign = 'center';
    containerEl.style.marginLeft = 'auto';
    containerEl.style.marginRight = 'auto';
    containerEl.style.float = 'none';
  });

  // Set body styles for better centering
  doc.body.style.margin = '0';
  doc.body.style.padding = '0';
  doc.body.style.textAlign = 'center';
  doc.body.style.display = 'flex';
  doc.body.style.flexDirection = 'column';
  doc.body.style.alignItems = 'center';
  doc.body.style.justifyContent = 'center';
  doc.body.style.width = '100%';
};
