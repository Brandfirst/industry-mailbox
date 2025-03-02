
import React from 'react';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  isMobile?: boolean;
}

const NewsletterPreview = ({ content, title, isMobile = false }: NewsletterPreviewProps) => {
  const getIframeContent = () => {
    if (!content) {
      return `<!DOCTYPE html><html><head></head><body><p>No content available</p></body></html>`;
    }
    
    // Replace all http:// with https:// to prevent mixed content warnings
    let secureContent = content.replace(/http:\/\//g, 'https://');
    
    return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              height: 100%;
              width: 100%;
              background-color: white;
            }
            body {
              ${isMobile ? 'transform: scale(0.25); transform-origin: 0 0; width: 400%; height: 400%;' : ''}
            }
            a {
              pointer-events: none;
            }
            img {
              max-width: 100%;
              height: auto;
              display: inline-block;
            }
            * {
              max-width: 100%;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>${secureContent}</body>
      </html>`;
  };

  if (!content) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-xs md:text-base">No preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <iframe
        srcDoc={getIframeContent()}
        title={title || "Newsletter Content"}
        className="w-full h-full border-0"
        sandbox="allow-same-origin"
        style={{ 
          pointerEvents: "none",
          display: "block"
        }}
      />
    </div>
  );
};

export default NewsletterPreview;
