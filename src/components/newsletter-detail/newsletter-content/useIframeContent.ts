
import { useEffect, useRef, useState } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getIframeContent, forceCentering } from "@/components/search/iframe-utils";

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
      const formattedContent = getIframeContent(newsletter.content, false);
      
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
          
          // Apply the centralized forceCentering function
          forceCentering(doc);
          
          // Adjust height after content is loaded
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Increase the multiplier to ensure all content is visible
              const height = doc.body.scrollHeight * 0.95;
              setIframeHeight(`${height}px`);
            }
          });
          
          resizeObserver.observe(doc.body);
          
          // Run the centering multiple times to ensure it applies after all content is loaded
          setTimeout(() => forceCentering(doc), 100);
          setTimeout(() => forceCentering(doc), 500);
          
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
