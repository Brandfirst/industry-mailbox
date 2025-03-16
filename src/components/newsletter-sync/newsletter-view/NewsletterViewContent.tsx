
import React, { useRef, useEffect, useState } from 'react';
import { Newsletter } from "@/lib/supabase";
import { Mail, ExternalLink } from "lucide-react";
import { generateIframeContent } from './utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NewsletterViewContentProps {
  newsletter: Newsletter;
}

export function NewsletterViewContent({
  newsletter
}: NewsletterViewContentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [hasIframeLoaded, setHasIframeLoaded] = useState(false);

  // Navigate to the full newsletter detail page
  const goToNewsletterPage = () => {
    if (newsletter.id) {
      navigate(`/newsletter/${newsletter.id}`);
    }
  };

  // Handle iframe load to ensure proper content display
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      try {
        // Generate content or use placeholder
        let content = null;
        
        if (newsletter.content) {
          content = generateIframeContent(newsletter.content);
          setHasIframeLoaded(true);
        } else if (newsletter.id && typeof newsletter.id === 'number') {
          // For emails with an ID but no content, we'll show a loading message
          // and suggest viewing the full newsletter
          content = generateIframeContent(`
            <div style="text-align: center; padding: 20px;">
              <h3>Loading newsletter content...</h3>
              <p>Click the "View Full Newsletter" button above to see the complete newsletter.</p>
            </div>
          `);
        } else {
          // For emails with neither content nor ID (sync log data only)
          content = generateIframeContent(`
            <div style="text-align: center; padding: 20px;">
              <h3>No content available</h3>
              <p>This information is from the sync log and contains limited details.</p>
              <p>To view the full email content, visit the Newsletter Sync page.</p>
            </div>
          `);
        }
        
        if (content) {
          const doc = iframeRef.current.contentDocument;
          doc.open();
          doc.write(content);
          doc.close();
        }
      } catch (error) {
        console.error("Error loading newsletter content in iframe:", error);
        setHasIframeLoaded(false);
      }
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [newsletter.content, newsletter.title, newsletter.id]);

  return (
    <div className="flex flex-col h-full">
      {newsletter.id && typeof newsletter.id === 'number' && (
        <div className="flex justify-end p-2 bg-gray-50 border-b">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNewsletterPage}
            className="text-xs"
          >
            View Full Newsletter <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="overflow-hidden flex-1 h-[calc(90vh-220px)] bg-white rounded-b-md">
        {(newsletter.content || newsletter.id) ? (
          <iframe 
            ref={iframeRef} 
            title={newsletter.title || "Newsletter Content"} 
            className="w-full h-full border-0" 
            sandbox="allow-same-origin" 
            style={{ overflow: 'hidden' }}
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
    </div>
  );
}
