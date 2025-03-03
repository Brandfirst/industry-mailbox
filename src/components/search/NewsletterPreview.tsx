
import React, { useRef, useEffect } from 'react';
import { sanitizeNewsletterContent, getSystemFontCSS } from '@/lib/utils/sanitizeContent';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  isMobile?: boolean;
}

const NewsletterPreview = ({ content, title, isMobile = false }: NewsletterPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const getIframeContent = () => {
    if (!content) {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>No content available</p></body></html>`;
    }
    
    // Sanitize content to prevent CORS issues with fonts
    let secureContent = sanitizeNewsletterContent(content);
    
    // Replace all http:// with https:// to prevent mixed content warnings
    secureContent = secureContent.replace(/http:\/\//g, 'https://');
    
    // Remove any script tags to prevent sandbox warnings
    secureContent = secureContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');
    
    // Debug nordic characters for troubleshooting
    const nordicChars = (secureContent.match(/[ØÆÅøæå]/g) || []).join('');
    console.log('NORDIC CHARACTERS IN PREVIEW COMPONENT:', nordicChars || 'None found');
    
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; script-src 'none';">
          <style>
            ${getSystemFontCSS()}
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              height: 100%;
              width: 100%;
              background-color: white;
              border-radius: 12px;
            }
            body {
              ${isMobile ? 'zoom: 0.2;' : ''}
              padding: 10px;
            }
            a {
              pointer-events: none;
            }
            img {
              max-width: 100%;
              height: auto;
              display: inline-block;
            }
            * {
              max-width: 100%;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>${secureContent}</body>
      </html>`;
  };

  // Handle iframe load to ensure proper UTF-8 encoding
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const content = getIframeContent();
    
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open("text/html", "replace");
        doc.write(content);
        doc.close();
        
        // Debug: Check if charset meta is present after creation
        const metaCharset = doc.querySelector('meta[charset]');
        console.log('PREVIEW IFRAME CHARSET:', metaCharset ? metaCharset.getAttribute('charset') : 'Not found');
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
    
    // Also set content when iframe loads
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          doc.open("text/html", "replace");
          doc.write(content);
          doc.close();
        }
      } catch (error) {
        console.error("Error in iframe onload:", error);
      }
    };
  }, [content, isMobile]);

  if (!content) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
        <p className="text-gray-500 text-xs md:text-base">No preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white rounded-xl">
      <iframe
        ref={iframeRef}
        title={title || "Newsletter Content"}
        className="w-full h-full border-0 rounded-xl"
        sandbox="allow-same-origin"
        style={{ 
          pointerEvents: "none",
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />
    </div>
  );
};

export default NewsletterPreview;
