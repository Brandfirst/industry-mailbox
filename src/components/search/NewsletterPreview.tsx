
import React, { useRef, useEffect, useState } from 'react';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  isMobile?: boolean;
}

const NewsletterPreview = ({ content, title, isMobile = false }: NewsletterPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<string>(isMobile ? "100%" : "100%");
  
  const getIframeContent = () => {
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

  // Handle iframe load and resize
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const content = getIframeContent();
    
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open("text/html", "replace");
        doc.write(content);
        doc.close();
        
        // Apply forced centering to all elements
        const forceCentering = () => {
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
        };
        
        // Adjust iframe height to content for better display
        if (!isMobile) {
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Account for the scale factor when setting the height
              const computedHeight = doc.body.scrollHeight * (isMobile ? 0.6 : 0.7);
              setIframeHeight(`${computedHeight}px`);
              
              // Apply forced centering
              forceCentering();
              
              // Set body styles for better centering
              doc.body.style.margin = '0';
              doc.body.style.padding = '0';
              doc.body.style.textAlign = 'center';
              doc.body.style.display = 'flex';
              doc.body.style.flexDirection = 'column';
              doc.body.style.alignItems = 'center';
              doc.body.style.justifyContent = 'center';
              doc.body.style.width = '100%';
            }
          });
          
          resizeObserver.observe(doc.body);
          
          // Run the centering after a small delay to ensure styles are applied
          setTimeout(forceCentering, 100);
          
          return () => {
            resizeObserver.disconnect();
          };
        }
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
  }, [content, isMobile]);

  if (!content) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
        <p className="text-gray-500 text-xs md:text-base">No preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white rounded-xl">
      <iframe
        ref={iframeRef}
        title={title || "Newsletter Content"}
        className="w-full h-full border-0 rounded-xl"
        sandbox="allow-same-origin"
        style={{ 
          pointerEvents: "none",
          display: "block",
          width: "100%",
          height: iframeHeight,
          overflow: "hidden",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />
    </div>
  );
};

export default NewsletterPreview;
