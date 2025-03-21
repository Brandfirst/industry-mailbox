
/**
 * Generates formatted HTML content for the newsletter iframe
 * 
 * @param content The raw HTML content
 * @param isMobile Whether the display is for mobile
 * @param isSnapshot Whether to display as a snapshot/thumbnail
 * @returns Properly formatted HTML with styles for display
 */
export const getIframeContent = (content: string | null, isMobile: boolean = false, isSnapshot: boolean = false): string => {
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
          ${getIframeStyles(isMobile, isSnapshot)}
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
 * Get the CSS styles for the iframe content
 * 
 * @param isMobile Whether styles are for mobile view
 * @param isSnapshot Whether this is a snapshot/thumbnail view
 * @returns CSS styles as a string
 */
const getIframeStyles = (isMobile: boolean = false, isSnapshot: boolean = false): string => {
  // Optimize scale factors for each mode to improve appearance based on viewport
  const baseScale = isSnapshot ? 
    (isMobile ? '0.45' : '0.9') : 
    (isMobile ? '0.6' : '0.95');
  
  return `
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100%;
      width: 100%;
      background-color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow-x: hidden !important;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    body {
      padding: 0 !important; 
      margin: 0 auto !important;
      width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow-x: hidden !important;
      transform: scale(${baseScale}); 
      transform-origin: top center;
    }
    
    /* Preserve the pointer-events none for links */
    a {
      pointer-events: none;
    }
    
    /* Ensure images don't overflow their containers */
    img {
      max-width: 100%;
      height: auto;
      display: inline-block;
    }
    
    /* Create a centered container for newsletter content */
    .newsletter-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      overflow-x: hidden !important;
      text-align: center !important;
      background-color: white;
      ${isSnapshot ? 'max-height: none; overflow-y: visible;' : ''}
    }
    
    /* Make sure tables don't overflow */
    table {
      max-width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      table-layout: auto !important;
      display: table !important;
      border-collapse: collapse !important;
    }
    
    /* Handle nested tables often used in newsletters */
    table table {
      width: 100% !important;
    }
    
    /* Center common newsletter container elements */
    .wrapper, .container, [class*="container"], [class*="wrapper"], 
    .email-body, .email-content, .main, .content,
    [class*="body"], [class*="main"], [class*="content"], [class*="inner"] {
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
    
    /* Fix common alignment issues */
    [align="left"], [style*="text-align: left"] {
      text-align: left !important;
    }
    
    [align="right"], [style*="text-align: right"] {
      text-align: right !important;
    }
    
    [align="center"], [style*="text-align: center"] {
      text-align: center !important;
    }
    
    ${isSnapshot ? `
    /* Snapshot specific styles */
    body {
      transform: scale(${baseScale}) !important;
    }
    ` : ''}
  `;
};
