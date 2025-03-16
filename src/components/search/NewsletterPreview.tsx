
import React from 'react';
import EmptyPreview from './EmptyPreview';
import IframePreview from './IframePreview';

interface NewsletterPreviewProps {
  content: string | null;
  title: string | null;
  isMobile?: boolean;
  mode?: 'full' | 'snapshot';
  maxHeight?: string;
}

const NewsletterPreview = ({ 
  content, 
  title, 
  isMobile = false,
  mode = 'full',
  maxHeight 
}: NewsletterPreviewProps) => {
  if (!content) {
    return <EmptyPreview />;
  }

  return (
    <div className="w-full h-full overflow-hidden bg-white rounded-xl flex justify-center items-start">
      <IframePreview 
        content={content}
        title={title}
        isMobile={isMobile}
        mode={mode}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default NewsletterPreview;
