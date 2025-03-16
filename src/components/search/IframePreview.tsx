
import React, { useRef, useEffect, useState } from 'react';
import { getIframeContent, forceCentering } from './iframe-utils';

interface IframePreviewProps {
  content: string;
  title: string | null;
  isMobile?: boolean;
  mode?: 'full' | 'snapshot';
  maxHeight?: string;
}

const IframePreview: React.FC<IframePreviewProps> = ({ 
  content, 
  title, 
  isMobile = false,
  mode = 'full',
  maxHeight
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<string>(maxHeight || (isMobile ? "250px" : "400px"));
  
  // Handle iframe load and resize
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const formattedContent = getIframeContent(content, isMobile, mode === 'snapshot');
    
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open("text/html", "replace");
        doc.write(formattedContent);
        doc.close();
        
        // Set fixed height based on device type and mode
        setIframeHeight(maxHeight || (isMobile ? "250px" : mode === 'snapshot' ? "300px" : "400px"));
        
        // Apply centering
        forceCentering(doc, mode === 'snapshot');
          
        // And again after short delays to handle any dynamic elements
        setTimeout(() => forceCentering(doc, mode === 'snapshot'), 100);
        setTimeout(() => forceCentering(doc, mode === 'snapshot'), 300);
      }
    } catch (error) {
      console.error("Error writing to preview iframe:", error);
    }
  }, [content, isMobile, mode, maxHeight]);

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
