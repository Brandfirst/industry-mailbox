
import React from 'react';
import { Newsletter } from '@/lib/supabase/types';
import NewsletterPreview from './NewsletterPreview';

interface NewsletterItemDesktopProps {
  newsletter: Newsletter;
  onClick: () => void;
  getFormattedDate: (dateString: string) => string;
}

const NewsletterItemDesktop = ({ newsletter, onClick, getFormattedDate }: NewsletterItemDesktopProps) => {
  return (
    <div className="hidden md:flex md:flex-col h-[500px]" onClick={onClick}>
      <div className="flex items-center p-3 border-b">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
          {newsletter.sender && (
            <span className="text-sm font-semibold text-gray-700">
              {newsletter.sender.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-sm truncate text-black">{newsletter.sender || 'Unknown Sender'}</span>
          <span className="text-black text-xs">
            NO • {getFormattedDate(newsletter.published_at || '')}
          </span>
        </div>
        {newsletter.categories?.name && (
          <div 
            className="px-2 py-1 text-xs rounded-full font-medium ml-auto"
            style={{ 
              backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
              color: newsletter.categories?.color || '#8B5CF6' 
            }}
          >
            {newsletter.categories.name}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden bg-white">
        <NewsletterPreview 
          content={newsletter.content} 
          title={newsletter.title}
          isMobile={false}
        />
      </div>
    </div>
  );
};

export default NewsletterItemDesktop;
