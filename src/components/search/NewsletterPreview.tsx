
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
            }
            body {
              padding: 0;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
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
            }
            * {
              max-width: 100%;
              box-sizing: border-box;
            }
            /* Fixed content centering and scaling */
            body > * {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 auto !important;
              float: none !important;
              transform: scale(${isMobile ? '0.6' : '0.7'});
              transform-origin: top center;
              left: 0 !important;
              right: 0 !important;
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
        
        // Adjust iframe height to content for better display
        if (!isMobile) {
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Account for the scale factor when setting the height
              const computedHeight = doc.body.scrollHeight * (isMobile ? 0.6 : 0.7);
              setIframeHeight(`${computedHeight}px`);
              
              // Fix any left-aligned tables or divs
              const tables = doc.querySelectorAll('table');
              tables.forEach(table => {
                // Cast to HTMLTableElement before accessing style
                const tableEl = table as HTMLTableElement;
                tableEl.style.margin = '0 auto';
                tableEl.style.float = 'none';
                tableEl.style.display = 'table';
                
                // Fix any cells that might be left-aligned
                const cells = table.querySelectorAll('td, th');
                cells.forEach(cell => {
                  // Cast to HTMLTableCellElement before accessing style
                  const cellEl = cell as HTMLTableCellElement;
                  cellEl.style.textAlign = 'center';
                });
              });
              
              // Force divs to center
              const divs = doc.querySelectorAll('div');
              divs.forEach(div => {
                // Cast to HTMLDivElement before accessing style
                const divEl = div as HTMLDivElement;
                if (getComputedStyle(divEl).display !== 'inline') {
                  divEl.style.margin = '0 auto';
                  divEl.style.float = 'none';
                }
              });
            }
          });
          
          resizeObserver.observe(doc.body);
          
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
