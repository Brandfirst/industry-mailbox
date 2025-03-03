
import { Newsletter } from "@/lib/supabase/types";
import { useEffect, useRef, useState } from "react";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent = ({ newsletter }: NewsletterContentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  
  // Create a properly encoded HTML content
  const getFormattedHtmlContent = () => {
    if (!newsletter.content) return '';
    
    // Log the raw content for debugging
    console.log('PREPARING CONTENT FOR IFRAME (first 100 chars):', newsletter.content.substring(0, 100));
    
    // Get Nordic characters for debugging
    const nordicChars = (newsletter.content.match(/[ØÆÅøæå]/g) || []).join('');
    console.log('NORDIC CHARACTERS BEFORE PROCESSING:', nordicChars || 'None found');
    
    // Force HTTPS
    let content = newsletter.content.replace(/http:\/\//g, 'https://');
    
    // Ensure content has HTML5 doctype and proper UTF-8 encoding
    if (!content.trim().toLowerCase().startsWith('<!doctype')) {
      content = `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                      body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        padding: 20px;
                        line-height: 1.6;
                      }
                      img { max-width: 100%; height: auto; }
                      * { box-sizing: border-box; }
                      p, h1, h2, h3, h4, h5, h6, span, div { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                      }
                    </style>
                  </head>
                  <body>${content}</body>
                </html>`;
    } else if (!content.includes('<meta charset="utf-8">')) {
      // Has HTML structure but missing charset meta - add it
      const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
      const headMatch = content.match(headRegex);
      
      if (headMatch) {
        const charset = '<meta charset="utf-8">\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
        const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        const fontStyle = `<style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          body, p, h1, h2, h3, h4, h5, h6, span, div { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
          }
          img { max-width: 100%; height: auto; }
        </style>`;
        
        // Replace the entire head with our updated version
        content = content.replace(
          headMatch[0],
          `<head>\n${charset}\n${viewportMeta}\n${fontStyle}\n${headMatch[1]}\n</head>`
        );
      }
    }
    
    return content;
  };
  
  // Handle iframe content injection with UTF-8 enforcement
  useEffect(() => {
    const setupIframe = () => {
      if (!iframeRef.current) return;
      
      try {
        // Get the document object for the iframe
        const doc = iframeRef.current.contentDocument;
        if (!doc) {
          console.error("Could not access iframe document");
          return;
        }
        
        // Get formatted content
        const htmlContent = getFormattedHtmlContent();
        
        // Open document, write content with UTF-8 character set, and close
        doc.open("text/html", "replace");
        
        // Critical step: Write a UTF-8 doctype and charset before anything else
        doc.write(htmlContent);
        doc.close();
        
        // Log iframe document charset after setting up
        const metaCharset = doc.querySelector('meta[charset]');
        console.log('IFRAME charset meta:', metaCharset ? metaCharset.getAttribute('charset') : 'Not found');
        
        // Set up resize observer to adjust iframe height to content
        setTimeout(() => {
          try {
            if (doc.body && iframeRef.current) {
              const height = doc.body.scrollHeight;
              setIframeHeight(`${height + 50}px`);
              console.log(`Set iframe height to ${height + 50}px`);
            }
          } catch (e) {
            console.error("Error adjusting iframe height:", e);
          }
        }, 300);
      } catch (error) {
        console.error("Error setting up iframe:", error);
      }
    };
    
    setupIframe();
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
