
import React, { useRef, useEffect, useState } from 'react';
import { getIframeContent, forceCentering } from './iframe-utils';

interface IframePreviewProps {
  content: string;
  title: string | null;
  isMobile?: boolean;
}

const IframePreview: React.FC<IframePreviewProps> = ({ content, title, isMobile = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<string>("400px");
  
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
        
        // Set fixed height based on device type
        setIframeHeight(isMobile ? "250px" : "400px");
        
        // Apply centering
        forceCentering(doc);
          
        // And again after short delays to handle any dynamic elements
        setTimeout(() => forceCentering(doc), 100);
        setTimeout(() => forceCentering(doc), 300);
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
  }, [content, isMobile]);

  return (
    <div className="w-full h-full flex justify-center items-start bg-white">
      <iframe
        ref={iframeRef}
        title={title || "Newsletter Content"}
        className="w-full h-full border-0 rounded-xl bg-white"
        sandbox="allow-same-origin"
        style={{ 
          pointerEvents: "none",
          display: "block",
          width: "100%",
          height: iframeHeight,
          overflow: "hidden", 
          objectFit: "contain",
          borderRadius: "12px",
          padding: "0",
          margin: "0 auto",
          backgroundColor: "white"
        }}
      />
    </div>
  );
};

export default IframePreview;
