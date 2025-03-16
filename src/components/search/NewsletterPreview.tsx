
import React from 'react';
import EmptyPreview from './EmptyPreview';
import IframePreview from './IframePreview';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  isMobile?: boolean;
}

const NewsletterPreview = ({ content, title, isMobile = false }: NewsletterPreviewProps) => {
  if (!content) {
    return <EmptyPreview />;
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white rounded-xl flex justify-center items-start">
      <IframePreview 
        content={content}
        title={title}
        isMobile={isMobile}
      />
    </div>
  );
};

export default NewsletterPreview;
