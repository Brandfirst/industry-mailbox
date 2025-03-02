
import React from 'react';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  height?: string;
  width?: string;
  previewHeight?: string;
  previewWidth?: string;
}

const NewsletterPreview = ({ 
  content, 
  title, 
  height = "100%", 
  width = "100%",
  previewHeight = "200%",
  previewWidth = "200%" 
}: NewsletterPreviewProps) => {
  const getIframeContent = () => {
    if (!content) {
      return `<!DOCTYPE html><html><head></head><body><p>No content available</p></body></html>`;
    }
    
    return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              height: 100%;
              width: 100%;
            }
            body {
              zoom: 0.4;
              -moz-transform: scale(0.4);
              -moz-transform-origin: 0 0;
              -o-transform: scale(0.4);
              -o-transform-origin: 0 0;
              -webkit-transform: scale(0.4);
              -webkit-transform-origin: 0 0;
              transform: scale(0.4);
              transform-origin: 0 0;
            }
            a {
              pointer-events: none;
            }
            * {
              max-width: 100%;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>`;
  };

  if (!content) {
    return (
      <div className={`w-full h-full bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500 text-xs md:text-base">No preview</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={getIframeContent()}
      title={title || "Newsletter Content"}
      className="w-full h-full border-0"
      sandbox="allow-same-origin"
      style={{ 
        height: previewHeight,
        width: previewWidth,
        pointerEvents: "none"
      }}
    />
  );
};

export default NewsletterPreview;
