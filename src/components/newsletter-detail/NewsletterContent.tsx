
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
    
    // Replace http:// with https:// for security
    let content = newsletter.content.replace(/http:\/\//g, 'https://');
    
    // Check if content already has proper HTML structure
    if (!content.trim().toLowerCase().startsWith('<!doctype')) {
      content = `<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body {
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        padding: 20px;
                      }
                      img { max-width: 100%; height: auto; }
                      * { box-sizing: border-box; }
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
            ${headMatch[1]}
          </head>`
        );
      }
    }
    
    return content;
  };
  
  // Handle iframe load to ensure proper character encoding
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(getSafeHtmlContent());
      doc.close();
    }
  }, [newsletter.content]);
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <iframe
          ref={iframeRef}
          srcDoc={getSafeHtmlContent()}
          title={newsletter.title || "Newsletter Content"}
          className="w-full min-h-[500px] border-0"
          sandbox="allow-same-origin"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
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
