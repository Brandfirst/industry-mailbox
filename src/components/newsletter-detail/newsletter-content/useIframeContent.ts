
import { useEffect, useRef, useState } from "react";
import { Newsletter } from "@/lib/supabase/types";

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
      // Use a simpler version of content processing
      let htmlContent = newsletter.content;
      
      // Only convert http to https for security
      htmlContent = htmlContent.replace(/http:\/\//g, 'https://');
      
      // Format it as proper HTML
      const formattedContent = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="script-src 'none'; frame-src 'none';">
            <style>
              body {
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                max-width: 100%;
              }
              img { max-width: 100%; height: auto; }
              * { box-sizing: border-box; }
              table {
                margin-left: auto;
                margin-right: auto;
                max-width: 100%;
              }
              div {
                max-width: 100%;
              }
              /* Center content */
              body > * {
                margin-left: auto;
                margin-right: auto;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>`;
      
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
              const height = doc.body.scrollHeight;
              setIframeHeight(`${height + 50}px`);
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
