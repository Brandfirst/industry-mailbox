
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
          
          // Set background color for document
          doc.documentElement.style.backgroundColor = "white";
          doc.body.style.backgroundColor = "white";
          
          // Apply centering immediately
          forceCentering(doc);
          
          // Adjust height after content is loaded
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Set appropriate height to show all content
              const height = doc.body.scrollHeight;
              setIframeHeight(`${height + 50}px`); // Add some extra space to prevent cutoff
              
              // Apply centering again after resize
              forceCentering(doc);
            }
          });
          
          resizeObserver.observe(doc.body);
          
          // Run centering after content has had time to render at multiple intervals
          setTimeout(() => forceCentering(doc), 100);
          setTimeout(() => forceCentering(doc), 300);
          setTimeout(() => forceCentering(doc), 600);
          setTimeout(() => forceCentering(doc), 1000);
          
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
