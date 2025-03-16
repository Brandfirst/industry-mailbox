
import React from 'react';
import { format } from 'date-fns';
import { Newsletter } from '@/lib/supabase/types';
import NewsletterItemMobile from './NewsletterItemMobile';
import NewsletterItemDesktop from './NewsletterItemDesktop';

interface NewsletterItemProps {
  newsletter: Newsletter;
  onClick: (newsletter: Newsletter) => void;
}

const NewsletterItem = ({ newsletter, onClick }: NewsletterItemProps) => {
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };

  // Determine the display name to use (brand_name if available, otherwise sender)
  const displayName = newsletter.brand_name || newsletter.sender || "Unknown Sender";
  
  // Create a single handler that uses the onClick prop
  const handleClick = () => {
    onClick(newsletter);
  };

  return (
    <div 
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <NewsletterItemMobile 
        newsletter={newsletter} 
        onClick={(e) => {
          // Prevent the child's onClick from triggering twice
          e.stopPropagation();
          handleClick();
        }} 
        getFormattedDate={getFormattedDate}
        displayName={displayName}
      />
      
      <NewsletterItemDesktop 
        newsletter={newsletter} 
        onClick={(e) => {
          // Prevent the child's onClick from triggering twice
          e.stopPropagation();
          handleClick();
        }} 
        getFormattedDate={getFormattedDate}
        displayName={displayName}
      />
    </div>
  );
};

export default NewsletterItem;
