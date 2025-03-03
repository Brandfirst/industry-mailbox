
import { Newsletter } from "@/lib/supabase/types";

interface NewsletterContentProps {
  newsletter: Newsletter;
}

const NewsletterContent = ({ newsletter }: NewsletterContentProps) => {
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
                  </head>
                  <body>${content}</body>
                </html>`;
    }
    
    return content;
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white p-6">
      {newsletter.content ? (
        <iframe
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
