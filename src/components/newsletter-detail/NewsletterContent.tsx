
import { Newsletter } from "@/lib/supabase/types";
import { useEffect, useRef } from "react";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent = ({ newsletter }: NewsletterContentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Create a safe HTML content with proper encoding
  const getSafeHtmlContent = () => {
    if (!newsletter.content) return '';
    
    // Log raw content to debug character encoding issues
    console.log('Raw content (first 100 chars):', newsletter.content.substring(0, 100));
    
    // Replace http:// with https:// for security
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
      // Add charset meta if missing but has HTML structure
      const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        content = content.replace(
          headMatch[0],
          `<head${headMatch[0].substring(5, headMatch[0].indexOf('>'))}>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
              body, p, h1, h2, h3, h4, h5, h6, span, div { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
              }
            </style>
            ${headMatch[1]}
          </head>`
        );
      }
    }
    
    return content;
  };
  
  // Handle iframe load to ensure proper character encoding
  useEffect(() => {
    if (iframeRef.current) {
      const content = getSafeHtmlContent();
      
      // Use document.write to directly inject content with correct encoding
      // This helps preserve special characters like ØÆÅ
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open('text/html', 'replace');
          doc.write(content);
          doc.close();
          
          // Additional check to ensure the document is using UTF-8
          const meta = doc.createElement('meta');
          meta.setAttribute('charset', 'utf-8');
          if (doc.head && !doc.head.querySelector('meta[charset]')) {
            doc.head.insertBefore(meta, doc.head.firstChild);
          }
          
          console.log("Newsletter content loaded with UTF-8 encoding");
        }
      } catch (error) {
        console.error("Error writing to iframe document:", error);
      }
    }
  }, [newsletter.content]);
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <iframe
          ref={iframeRef}
          title={newsletter.title || "Newsletter Content"}
          className="w-full min-h-[500px] border-0"
          sandbox="allow-same-origin"
          style={{
            display: "block",
            width: "100%",
            height: "100vh", // Make it taller to show more content
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
