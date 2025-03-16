
import React, { useRef, useEffect, useState } from 'react';
import { Newsletter } from "@/lib/supabase";
import { Mail } from "lucide-react";
import { generateIframeContent } from './utils';

interface NewsletterViewContentProps {
  newsletter: Newsletter;
}

export function NewsletterViewContent({
  newsletter
}: NewsletterViewContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasErrors, setHasErrors] = useState(false);

  // Handle iframe load to ensure proper character encoding
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const content = generateIframeContent(newsletter.content);
      if (content) {
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(content);
        doc.close();

        // Add error handler to catch and prevent iframe errors
        iframeRef.current.contentWindow?.addEventListener('error', e => {
          e.preventDefault();
          e.stopPropagation();

          // Check if this is a certificate error or tracking pixel
          const isTrackingError = e.message && (e.message.includes('certificate') || e.message.includes('tracking') || e.message.includes('analytics') || e.message.includes('ERR_CERT') || e.message.includes('net::'));
          if (!isTrackingError) {
            setHasErrors(true);
            doc.body.classList.add('has-error');
          }
          return true;
        }, true);
      }
    }
    return () => {
      // Cleanup if needed
    };
  }, [newsletter.content]);

  return <div className="overflow-auto flex-1 h-[calc(90vh-220px)] bg-white rounded-b-md">
      {hasErrors && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-4 text-sm">
          <p className="text-amber-700">Some content in this newsletter could not be displayed properly due to security restrictions.</p>
        </div>
      )}
      
      {newsletter.content ? <iframe ref={iframeRef} title={newsletter.title || "Newsletter Content"} className="w-full h-full border-0" sandbox="allow-same-origin" /> : <div className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">No content available for this newsletter.</p>
        </div>}
    </div>;
}
