
import React from "react";
import { Newsletter } from "@/lib/supabase/types";
import { useIframeContent } from "./useIframeContent";
import ErrorAlert from "./ErrorAlert";
import EmptyState from "./EmptyState";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent: React.FC<NewsletterContentProps> = ({ newsletter }) => {
  const { iframeRef, iframeHeight, hasErrors } = useIframeContent(newsletter);
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <>
          <ErrorAlert show={hasErrors} />
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
        <EmptyState />
      )}
    </div>
  );
};

export default NewsletterContent;
