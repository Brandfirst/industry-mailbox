
import React from 'react';
import { Newsletter } from '@/lib/supabase/types';
import NewsletterPreview from './NewsletterPreview';

interface NewsletterItemMobileProps {
  newsletter: Newsletter;
  onClick: () => void;
  getFormattedDate: (dateString: string) => string;
}

const NewsletterItemMobile = ({ newsletter, onClick, getFormattedDate }: NewsletterItemMobileProps) => {
  return (
    <div className="md:hidden flex" onClick={onClick}>
      <div className="w-1/3 h-56 bg-white overflow-hidden">
        <div className="w-full h-full">
          <NewsletterPreview 
            content={newsletter.content} 
            title={newsletter.title}
            isMobile={true}
          />
        </div>
      </div>
      
      <div className="w-2/3 p-3 flex flex-col">
        <div className="flex items-center mb-1">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
            {newsletter.sender && (
              <span className="text-xs font-semibold text-gray-700">
                {newsletter.sender.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-medium text-xs truncate text-black">{newsletter.sender || 'Unknown Sender'}</span>
          <span className="text-black text-xs ml-1">
            {newsletter.categories?.name && (
              <span 
                className="px-1.5 py-0.5 text-xs rounded-full font-medium ml-auto"
                style={{ 
                  backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                  color: newsletter.categories?.color || '#8B5CF6' 
                }}
              >
                {newsletter.categories.name}
              </span>
            )}
          </span>
        </div>
        
        <div className="line-clamp-2 text-sm font-medium text-black mb-1">
          {newsletter.title || 'Untitled Newsletter'}
        </div>
        
        <div className="text-xs text-gray-500 mt-auto">
          {getFormattedDate(newsletter.published_at || '')}
        </div>
      </div>
    </div>
  );
};

export default NewsletterItemMobile;
