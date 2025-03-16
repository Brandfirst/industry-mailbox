
import React, { useRef, useEffect, useState } from 'react';
import { getIframeContent, forceCentering } from './iframe-utils';

interface IframePreviewProps {
  content: string;
  title: string | null;
  isMobile?: boolean;
}

const IframePreview: React.FC<IframePreviewProps> = ({ content, title, isMobile = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<string>(isMobile ? "100%" : "100%");
  
  // Handle iframe load and resize
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const formattedContent = getIframeContent(content, isMobile);
    
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open("text/html", "replace");
        doc.write(formattedContent);
        doc.close();
        
        // Adjust iframe height to content for better display
        if (!isMobile) {
          const resizeObserver = new ResizeObserver(() => {
            if (doc.body) {
              // Ensure all content is visible
              const computedHeight = doc.body.scrollHeight;
              setIframeHeight(`${computedHeight}px`);
              
              // Apply gentle centering
              forceCentering(doc);
            }
          });
          
          resizeObserver.observe(doc.body);
          
          // Apply centering after content is loaded
          setTimeout(() => forceCentering(doc), 300);
          
          return () => {
            resizeObserver.disconnect();
          };
        }
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
  }, [content, isMobile]);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <iframe
        ref={iframeRef}
        title={title || "Newsletter Content"}
        className="w-full h-full border-0 rounded-xl"
        sandbox="allow-same-origin"
        style={{ 
          pointerEvents: "none",
          display: "block",
          width: "100%",
          height: iframeHeight,
          overflow: "hidden",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />
    </div>
  );
};

export default IframePreview;
