
import { Newsletter } from "@/lib/supabase/types";
import { useEffect, useRef, useState } from "react";
import { sanitizeNewsletterContent, getSystemFontCSS } from "@/lib/utils/sanitizeContent";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent = ({ newsletter }: NewsletterContentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  
  // Create formatted HTML content
  const getFormattedHtmlContent = () => {
    if (!newsletter.content) return '';
    
    console.log('PREPARING CONTENT FOR IFRAME (first 100 chars):', newsletter.content.substring(0, 100));
    
    // Check for Nordic characters before processing
    const nordicChars = (newsletter.content.match(/[ØÆÅøæå]/g) || []).join('');
    console.log('NORDIC CHARACTERS IN CONTENT COMPONENT:', nordicChars || 'None found');
    
    // Sanitize content to prevent CORS issues with fonts
    let content = sanitizeNewsletterContent(newsletter.content);
    
    // Force HTTPS
    content = content.replace(/http:\/\//g, 'https://');
    
    // Ensure content has proper HTML structure with UTF-8 encoding
    return `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; script-src 'none';">
                <style>
                  ${getSystemFontCSS()}
                  body {
                    padding: 20px;
                    line-height: 1.6;
                  }
                  img { max-width: 100%; height: auto; }
                  * { box-sizing: border-box; }
                </style>
              </head>
              <body>${content}</body>
            </html>`;
  };
  
  // Handle iframe content with UTF-8 enforcement
  useEffect(() => {
    if (!iframeRef.current || !newsletter.content) return;
    
    try {
      const iframe = iframeRef.current;
      const htmlContent = getFormattedHtmlContent();
      
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
          
          // Log charset after setting
          const metaCharset = doc.querySelector('meta[charset]');
          console.log('CONTENT IFRAME CHARSET:', metaCharset ? metaCharset.getAttribute('charset') : 'Not found');
          
          // Adjust height after content is loaded
          setTimeout(() => {
            if (doc.body && iframe) {
              const height = doc.body.scrollHeight;
              setIframeHeight(`${height + 50}px`);
              console.log(`Set iframe height to ${height + 50}px`);
            }
          }, 500);
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
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <iframe
          ref={iframeRef}
          title={newsletter.title || "Newsletter Content"}
          className="w-full border-0"
          sandbox="allow-same-origin"
          style={{
            display: "block",
            width: "100%",
            height: iframeHeight,
            overflow: "hidden"
          }}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No content available</p>
        </div>
      )}
    </div>
  );
};

export default NewsletterContent;
