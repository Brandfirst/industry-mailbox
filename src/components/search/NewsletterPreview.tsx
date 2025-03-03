
import React, { useRef, useEffect } from 'react';
import { 
  sanitizeNewsletterContent, 
  getSystemFontCSS, 
  ensureUtf8Encoding,
  debugLog
} from '@/lib/utils/content-sanitization';
import {
  removeTrackingPixels,
  shouldSuppressError,
  getSecureCSP
} from '@/lib/utils/content-sanitization/trackingFilter';

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
    
    // Ensure UTF-8 encoding of content with our enhanced function
    let encodedContent = ensureUtf8Encoding(content);
    
    // Check for Nordic characters
    const nordicChars = (encodedContent.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS IN PREVIEW BEFORE SANITIZE:', nordicChars || 'None found');
    
    // If no Nordic characters found but potential double-encoded sequences exist, log them
    if (!nordicChars) {
      const potentialDoubleEncoded = encodedContent.match(/Ã[…†˜¦ø¸]/g);
      if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
        debugLog('Potential double-encoded characters in preview:', potentialDoubleEncoded.join(', '));
      }
    }
    
    // Sanitize content to prevent CORS issues with fonts
    let secureContent = sanitizeNewsletterContent(encodedContent);
    
    // Replace all http:// with https:// to prevent mixed content warnings
    secureContent = secureContent.replace(/http:\/\//g, 'https://');
    
    // Use our enhanced tracking pixel removal
    secureContent = removeTrackingPixels(secureContent);
    
    // Remove any script tags to prevent sandbox warnings
    secureContent = secureContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');
    
    // Remove problematic link tags that could cause certificate errors
    secureContent = secureContent.replace(/<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, '<!-- problematic link removed -->');
    
    // Re-check Nordic characters after sanitizing
    const nordicCharsAfter = (secureContent.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS IN PREVIEW AFTER SANITIZE:', nordicCharsAfter || 'None found');
    
    // Add data attribute if has Nordic characters for special font handling
    const hasNordicAttribute = nordicCharsAfter ? 'data-has-nordic-chars="true"' : '';
    
    return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta http-equiv="Content-Security-Policy" content="${getSecureCSP()}">
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
            /* Error message styling */
            .error-overlay {
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(255,255,255,0.9);
              justify-content: center;
              align-items: center;
              z-index: 100;
              text-align: center;
              padding: 20px;
            }
            .has-error .error-overlay {
              display: flex;
            }
          </style>
          <script>
            // Comprehensive error handler
            window.addEventListener('error', function(e) {
              // Always prevent default error behavior
              e.preventDefault();
              e.stopPropagation();
              
              // Check if this is a security-related error that should be suppressed
              const errorMsg = e.message || '';
              const isTrackingError = ${shouldSuppressError.toString()}(errorMsg);
              
              // If it's a tracking error, just silently ignore
              // Only show error UI for non-tracking errors
              if (!isTrackingError) {
                document.body.classList.add('has-error');
                console.log('Non-tracking error occurred:', errorMsg);
              }
              
              return true; // Prevents the error from bubbling up
            }, true);
            
            // Suppress console errors too
            const originalConsoleError = console.error;
            console.error = function() {
              const args = Array.from(arguments);
              const errorString = args.join(' ');
              
              // Only pass through non-tracking errors
              if (!${shouldSuppressError.toString()}(errorString)) {
                originalConsoleError.apply(console, args);
              }
            };
          </script>
        </head>
        <body ${hasNordicAttribute}>
          ${secureContent}
          <div class="error-overlay">
            <div>
              <p>Some content couldn't be displayed properly.</p>
            </div>
          </div>
        </body>
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
        
        // Add a handler to catch and stop further errors in the iframe
        iframe.contentWindow?.addEventListener('error', (e) => {
          // Prevent the error from showing in console
          e.preventDefault();
          e.stopPropagation();
          
          // Use our utility to determine if this is a tracking error
          if (!shouldSuppressError(e)) {
            // Add error class to show error message for non-tracking errors
            doc.body.classList.add('has-error');
          }
          
          return true; // Prevents the error from bubbling up
        }, true);
        
        // Override console.error in iframe to hide tracking errors
        if (iframe.contentWindow) {
          // Use type assertion to access console
          const win = iframe.contentWindow as (Window & typeof globalThis);
          const originalConsoleError = win.console.error;
          
          // Assign the new console.error function
          win.console.error = function(...args: any[]) {
            const errorString = args.join(' ');
            
            // Only pass through non-tracking errors
            if (!shouldSuppressError(errorString)) {
              originalConsoleError.apply(win.console, args);
            }
          };
        }
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
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
