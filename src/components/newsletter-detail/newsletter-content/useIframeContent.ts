
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
          
          // Force all fixed height elements to auto
          const fixElements = () => {
            // Apply to all elements to prevent padding/margin issues
            const allElements = doc.querySelectorAll('*');
            allElements.forEach(el => {
              const element = el as HTMLElement;
              // Force margin to auto for all elements
              element.style.marginLeft = 'auto';
              element.style.marginRight = 'auto';
              
              // Override specific styling causing left alignment
              if (window.getComputedStyle(element).float !== 'none') {
                element.style.float = 'none';
              }
              
              if (window.getComputedStyle(element).position === 'absolute') {
                element.style.position = 'relative';
                element.style.left = 'auto';
                element.style.right = 'auto';
              }
              
              // Force width and center alignment
              element.style.maxWidth = '100%';
            });
            
            // Apply specific fixes to common elements
            const containers = doc.querySelectorAll('div, section, table, td, tr, article, main, header, footer, p');
            containers.forEach(el => {
              const container = el as HTMLElement;
              container.style.width = '100%';
              container.style.marginLeft = 'auto';
              container.style.marginRight = 'auto';
              container.style.textAlign = 'center';
              container.style.display = container.tagName.toLowerCase() === 'table' ? 'table' : '';
              container.style.float = 'none';
            });
          };
          
          // Adjust height after content is loaded
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Account for the scale factor in the height calculation
              const height = doc.body.scrollHeight * 0.85;
              setIframeHeight(`${height}px`);
              
              // Add extra class to center content better
              doc.body.classList.add('centered-content');
              
              // Fix positioning issues
              fixElements();
              
              // Apply inline styles to body to ensure centering
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
          
          // Run the fixes after a small delay to ensure all styles are applied
          setTimeout(fixElements, 100);
          
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
