
import { useEffect, useRef, useState } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getFormattedHtmlContent } from "./iframe-utils";

export const useIframeContent = (newsletter: Newsletter) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  // Always set hasErrors to false so the error message never shows
  const hasErrors = false;

  // Handle iframe content
  useEffect(() => {
    if (!iframeRef.current || !newsletter.content) return;
    
    try {
      const iframe = iframeRef.current;
      const formattedContent = getFormattedHtmlContent(newsletter.content);
      
      // Wait for iframe to be available
      const setIframeContent = () => {
        try {
          // Get the document object for the iframe
          const doc = iframe.contentDocument;
          if (!doc) {
            console.error("Could not access iframe document");
            return;
          }
          
          // Write directly to the document
          doc.open("text/html", "replace");
          doc.write(formattedContent);
          doc.close();
          
          // Adjust height after content is loaded
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Account for the scale factor in the height calculation
              const height = doc.body.scrollHeight * 0.85;
              setIframeHeight(`${height}px`);
              
              // Add extra class to center content better
              doc.body.classList.add('centered-content');
              
              // Force center alignment on table elements
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
              
              // Force center alignment on div elements
              const divs = doc.querySelectorAll('div');
              divs.forEach(div => {
                // Cast to HTMLDivElement before accessing style
                const divEl = div as HTMLDivElement;
                if (getComputedStyle(divEl).display !== 'inline') {
                  divEl.style.margin = '0 auto';
                  divEl.style.float = 'none';
                }
              });
              
              // Override any left-aligned elements
              const leftAligned = doc.querySelectorAll('[align="left"], [style*="text-align: left"]');
              leftAligned.forEach(el => {
                // Cast to HTMLElement before accessing style
                const htmlEl = el as HTMLElement;
                htmlEl.setAttribute('style', 'text-align: center !important; margin: 0 auto !important;');
              });
            }
          });
          
          resizeObserver.observe(doc.body);
          
          return () => {
            resizeObserver.disconnect();
          };
        } catch (error) {
          console.error("Error writing to iframe:", error);
        }
      };
      
      // Set content immediately and also when iframe loads
      setIframeContent();
      iframe.onload = setIframeContent;
      
    } catch (error) {
      console.error("Error setting up iframe:", error);
    }
  }, [newsletter.content]);

  return {
    iframeRef,
    iframeHeight,
    hasErrors
  };
};
