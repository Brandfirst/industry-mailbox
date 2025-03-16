
import React from 'react';
import { Newsletter } from '@/lib/supabase/types';
import NewsletterPreview from './NewsletterPreview';
import { useNavigate } from 'react-router-dom';
import { navigateToSender } from '@/lib/utils/newsletterNavigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NewsletterItemMobileProps {
  newsletter: Newsletter;
  onClick: (e: React.MouseEvent) => void;
  getFormattedDate: (dateString: string) => string;
  displayName: string;
}

const NewsletterItemMobile = ({ newsletter, onClick, getFormattedDate, displayName }: NewsletterItemMobileProps) => {
  const navigate = useNavigate();
  
  const handleSenderClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick from firing
    e.preventDefault(); // Ensure no default behavior interferes
    const senderName = newsletter.sender || newsletter.brand_name || '';
    console.log("Mobile: Navigating to sender:", senderName);
    navigateToSender(senderName, navigate, e);
  };
  
  return (
    <div className="md:hidden flex border rounded-lg shadow-sm overflow-hidden bg-white mb-4" onClick={onClick}>
      <div className="w-1/3 h-56 bg-white overflow-hidden rounded-l-lg border-r">
        <div className="w-full h-full flex items-center justify-center p-1">
          <NewsletterPreview 
            content={newsletter.content} 
            title={newsletter.title}
            isMobile={true}
            mode="snapshot"
            maxHeight="100%"
          />
        </div>
      </div>
      
      <div className="w-2/3 p-3 flex flex-col">
        <div className="flex items-center mb-1">
          <Avatar 
            className="h-6 w-6 rounded-full mr-2 flex-shrink-0 cursor-pointer"
            onClick={handleSenderClick}
          >
            <AvatarFallback className="text-xs font-semibold bg-orange-500 text-white">
              {displayName && displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span 
            className="font-medium text-xs truncate text-black cursor-pointer hover:underline"
            onClick={handleSenderClick}
          >
            {displayName}
          </span>
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
