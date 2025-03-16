
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
    <div className="border rounded-lg overflow-hidden bg-white p-0">
      {newsletter.content ? (
        <>
          <ErrorAlert show={hasErrors} />
          <div className="w-full flex justify-center items-start overflow-hidden bg-white">
            <iframe
              ref={iframeRef}
              title={newsletter.title || "Newsletter Content"}
              className="w-full border-0 bg-white"
              sandbox="allow-same-origin"
              style={{
                display: "block",
                width: "100%",
                height: iframeHeight,
                overflow: "hidden",
                margin: "0 auto",
                padding: "0",
                backgroundColor: "white",
              }}
            />
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default NewsletterContent;
