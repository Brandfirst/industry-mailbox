
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
          ${getIframeStyles(isMobile)}
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
 * @returns CSS styles as a string
 */
const getIframeStyles = (isMobile: boolean = false): string => {
  return `
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100%;
      width: 100%;
      background-color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden !important;
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
      justify-content: center;
      overflow: hidden !important;
      ${isMobile ? '' : `
      transform: scale(0.9);
      transform-origin: center top;
      `}
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
      overflow: hidden !important;
      text-align: center !important;
      transform: scale(0.95);
      transform-origin: center top;
    }
    
    /* Make sure tables don't overflow */
    table {
      max-width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      width: auto !important; 
      table-layout: auto !important;
      transform: translateX(-50%) !important;
      left: 50% !important;
      position: relative !important;
    }
    
    /* Handle nested tables often used in newsletters */
    table table {
      width: 100% !important;
    }
    
    /* Center common newsletter container elements without transforming them */
    .wrapper, .container, [class*="container"], [class*="wrapper"], 
    .email-body, .email-content, .main, .content,
    [class*="body"], [class*="main"], [class*="content"], [class*="inner"] {
      margin-left: auto !important;
      margin-right: auto !important;
      width: auto !important;
      max-width: 100% !important;
      float: none !important;
      transform: translateX(-50%) !important;
      left: 50% !important;
      position: relative !important;
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
    
    /* Extra overrides for better centering */
    div, p, h1, h2, h3, h4, h5, h6, span, a, 
    section, article, header, footer, main {
      margin-left: auto !important;
      margin-right: auto !important;
      max-width: 100% !important;
    }
  `;
};
