
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

  return (
    <div 
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
    >
      <NewsletterItemMobile 
        newsletter={newsletter} 
        onClick={() => onClick(newsletter)} 
        getFormattedDate={getFormattedDate}
      />
      
      <NewsletterItemDesktop 
        newsletter={newsletter} 
        onClick={() => onClick(newsletter)} 
        getFormattedDate={getFormattedDate}
      />
    </div>
  );
};

export default NewsletterItem;
