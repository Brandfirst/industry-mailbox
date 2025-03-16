
import React, { useRef, useEffect } from 'react';
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

  // Handle iframe load to ensure proper content display
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      // Generate content or use placeholder
      const content = newsletter.content 
        ? generateIframeContent(newsletter.content)
        : generateIframeContent(`<p>No content available for this email.</p>
                               <p>This information is from the sync log and contains limited details.</p>
                               <p>To view the full email content, go to the Newsletter Sync page and view the emails there.</p>`);
                               
      if (content) {
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(content);
        doc.close();
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [newsletter.content, newsletter.title]);

  return (
    <div className="overflow-auto flex-1 h-[calc(90vh-220px)] bg-white rounded-b-md">
      {newsletter.content ? (
        <iframe 
          ref={iframeRef} 
          title={newsletter.title || "Newsletter Content"} 
          className="w-full h-full border-0" 
          sandbox="allow-same-origin" 
        /> 
      ) : (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {newsletter.title ? `No content available for "${newsletter.title}"` : "No content available for this email."}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mt-2">
            This information is from the sync log which only contains basic email details.
            To view the full content, go to the Newsletter Sync page.
          </p>
        </div>
      )}
    </div>
  );
}
