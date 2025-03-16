
import { useEffect, useRef, useState } from "react";
import { Newsletter } from "@/lib/supabase/types";
import { getFormattedHtmlContent } from "./iframe-utils";
import { debugLog } from "@/lib/utils/content-sanitization";

export const useIframeContent = (newsletter: Newsletter) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  const [hasErrors, setHasErrors] = useState(false);

  // Handle iframe content with UTF-8 enforcement
  useEffect(() => {
    if (!iframeRef.current || !newsletter.content) return;
    
    try {
      const iframe = iframeRef.current;
      const htmlContent = getFormattedHtmlContent(newsletter.content);
      
      // Wait for iframe to be available
      const setIframeContent = () => {
        try {
          // Get the document object for the iframe
          const doc = iframe.contentDocument;
          if (!doc) {
            console.error("Could not access iframe document");
            return;
          }
          
          // Write directly to the document with proper encoding
          doc.open("text/html", "replace");
          doc.write(htmlContent);
          doc.close();
          
          // Add a handler to catch and stop further errors in the iframe
          iframe.contentWindow?.addEventListener('error', (e) => {
            // Stop error propagation
            e.preventDefault();
            e.stopPropagation();
            
            // Check if this is a certificate or tracking error
            const isTrackingError = e.message && (
              e.message.includes('certificate') || 
              e.message.includes('tracking') || 
              e.message.includes('analytics') ||
              e.message.includes('ERR_CERT') ||
              e.message.includes('net::')
            );
            
            if (!isTrackingError) {
              setHasErrors(true);
              // Add error class to show error message
              doc.body.classList.add('has-error');
            }
            
            return true; // Prevents the error from bubbling up
          }, true);
          
          // Log charset after setting
          const metaCharset = doc.querySelector('meta[charset]');
          debugLog('CONTENT IFRAME CHARSET:', metaCharset ? metaCharset.getAttribute('charset') : 'Not found');
          
          // Adjust height after content is loaded
          setTimeout(() => {
            if (doc.body && iframe) {
              const height = doc.body.scrollHeight;
              setIframeHeight(`${height + 50}px`);
              debugLog(`Set iframe height to ${height + 50}px`);
            }
          }, 500);
        } catch (error) {
          console.error("Error writing to iframe:", error);
          setHasErrors(true);
        }
      };
      
      // Set content immediately and also when iframe loads
      setIframeContent();
      iframe.onload = setIframeContent;
      
    } catch (error) {
      console.error("Error setting up iframe:", error);
      setHasErrors(true);
    }
  }, [newsletter.content]);

  return {
    iframeRef,
    iframeHeight,
    hasErrors
  };
};
