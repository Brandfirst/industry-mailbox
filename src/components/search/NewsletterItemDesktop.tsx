
import React from 'react';
import { Newsletter } from '@/lib/supabase/types';
import NewsletterPreview from './NewsletterPreview';
import { useNavigate } from 'react-router-dom';
import { navigateToSender } from '@/lib/utils/newsletterNavigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface NewsletterItemDesktopProps {
  newsletter: Newsletter;
  onClick: (e: React.MouseEvent) => void;
  getFormattedDate: (dateString: string) => string;
  displayName: string;
}

const NewsletterItemDesktop = ({ newsletter, onClick, getFormattedDate, displayName }: NewsletterItemDesktopProps) => {
  const navigate = useNavigate();
  
  const handleSenderClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick from firing
    e.preventDefault(); // Ensure no default behavior interferes
    const senderName = newsletter.sender || newsletter.brand_name || '';
    console.log("Desktop: Navigating to sender:", senderName);
    navigateToSender(senderName, navigate, e);
  };
  
  return (
    <div className="hidden md:flex md:flex-col h-[500px]" onClick={onClick}>
      <div className="flex items-center p-3 border-b">
        <Avatar 
          className="h-8 w-8 rounded-full mr-2 flex-shrink-0 cursor-pointer"
          onClick={handleSenderClick}
        >
          <AvatarFallback className="text-sm font-semibold bg-orange-500 text-white">
            {displayName && displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col overflow-hidden">
          <span 
            className="font-medium text-sm truncate text-black cursor-pointer hover:underline"
            onClick={handleSenderClick}
          >
            {displayName}
          </span>
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
