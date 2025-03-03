
import { Newsletter } from "@/lib/supabase/types";
import { useEffect, useRef, useState } from "react";
import { 
  sanitizeNewsletterContent, 
  getSystemFontCSS, 
  ensureUtf8Encoding,
  debugLog
} from "@/lib/utils/content-sanitization";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent = ({ newsletter }: NewsletterContentProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  const [hasErrors, setHasErrors] = useState(false);
  
  // Create formatted HTML content with enhanced debugging
  const getFormattedHtmlContent = () => {
    if (!newsletter.content) return '';
    
    debugLog('PREPARING CONTENT FOR IFRAME (first 100 chars):', newsletter.content.substring(0, 100));
    
    // First ensure UTF-8 encoding with our enhanced function
    const utf8Content = ensureUtf8Encoding(newsletter.content);
    
    // Check for Nordic characters before processing
    const nordicChars = (utf8Content.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS IN CONTENT COMPONENT BEFORE SANITIZE:', nordicChars || 'None found');
    
    // If no Nordic characters found, search for potential mis-encoded sequences
    if (!nordicChars) {
      const potentialDoubleEncoded = utf8Content.match(/Ã[…†˜¦ø¸]/g);
      if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
        debugLog('Potential double-encoded characters found:', potentialDoubleEncoded.join(', '));
      }
    }
    
    // Sanitize content to prevent CORS issues with fonts
    let content = sanitizeNewsletterContent(utf8Content);
    
    // Force HTTPS
    content = content.replace(/http:\/\//g, 'https://');
    
    // More aggressive tracking pixel and analytics removal
    content = content.replace(/<img[^>]*?src=['"]https?:\/\/([^'"]+)\.(?:mail|click|url|send|analytics|track|open|beacon|wf|ea|stat)[^'"]*['"][^>]*>/gi, '<!-- tracking pixel removed -->');
    
    // Remove any script tags
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- scripts removed -->');
    
    // Remove problematic link tags that could cause certificate errors
    content = content.replace(/<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, '<!-- problematic link removed -->');
    
    // Add data attribute if it has Nordic characters for special font handling
    const hasNordicAttribute = nordicChars ? 'data-has-nordic-chars="true"' : '';
    
    // Re-check for Nordic characters after sanitization
    const nordicCharsAfter = (content.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS IN CONTENT COMPONENT AFTER SANITIZE:', nordicCharsAfter || 'None found');
    
    // Ensure content has proper HTML structure with UTF-8 encoding
    // but preserve original styling
    return `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; script-src 'none'; img-src 'self' data: https:; connect-src 'none'; frame-src 'none';">
                <style>
                  ${getSystemFontCSS()}
                  body {
                    padding: 20px;
                    line-height: 1.6;
                  }
                  img { max-width: 100%; height: auto; }
                  * { box-sizing: border-box; }
                  
                  /* Error message styling */
                  .error-overlay {
                    display: none;
                    padding: 10px;
                    margin: 10px 0;
                    background-color: #f8f9fa;
                    border-left: 4px solid #dc3545;
                    color: #333;
                  }
                  .has-error .error-overlay {
                    display: block;
                  }
                </style>
                <script>
                  // Suppress all errors to prevent console warnings
                  window.addEventListener('error', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Don't show error UI for tracking/analytics errors
                    const isTrackingError = e.message && (
                      e.message.includes('certificate') || 
                      e.message.includes('tracking') || 
                      e.message.includes('analytics') ||
                      e.message.includes('ERR_CERT') ||
                      e.message.includes('net::')
                    );
                    
                    if (!isTrackingError) {
                      // For serious errors, show the error message
                      document.body.classList.add('has-error');
                    }
                    
                    return true; // Prevents the error from bubbling up
                  }, true);
                </script>
              </head>
              <body ${hasNordicAttribute}>
                <div class="error-overlay">
                  <p>Some content in this newsletter could not be displayed properly. This is usually because of external resources that can't be loaded due to security restrictions.</p>
                </div>
                ${content}
              </body>
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
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <>
          {hasErrors && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 text-sm">
              <p className="text-amber-700">Some content in this newsletter could not be displayed properly due to security restrictions.</p>
            </div>
          )}
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
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No content available</p>
        </div>
      )}
    </div>
  );
};

export default NewsletterContent;
