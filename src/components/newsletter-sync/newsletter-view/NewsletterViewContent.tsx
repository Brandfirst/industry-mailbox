
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
      const content = generateIframeContent(newsletter.content);
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
  }, [newsletter.content]);

  return <div className="overflow-auto flex-1 h-[calc(90vh-220px)] bg-white rounded-b-md">
      {newsletter.content ? <iframe 
        ref={iframeRef} 
        title={newsletter.title || "Newsletter Content"} 
        className="w-full h-full border-0" 
        sandbox="allow-same-origin" 
      /> : <div className="text-center py-12">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {newsletter.title ? `No content available for "${newsletter.title}"` : "No content available for this newsletter."}
          </p>
        </div>}
    </div>;
}
