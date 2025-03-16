
import { format } from 'date-fns';
import { Newsletter } from "@/lib/supabase/types";
import { useNavigate } from "react-router-dom";
import { navigateToSender } from "@/lib/utils/newsletterNavigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NewsletterMetaProps {
  newsletter: Newsletter;
}

const NewsletterMeta = ({ newsletter }: NewsletterMetaProps) => {
  const navigate = useNavigate();
  
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const handleSenderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Meta: Navigating to sender:", newsletter.sender || newsletter.brand_name);
    const senderName = newsletter.sender || newsletter.brand_name || '';
    navigateToSender(senderName, navigate, e);
  };
  
  const senderInitial = (newsletter.sender || newsletter.brand_name || '?').charAt(0).toUpperCase();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Avatar 
          className="h-10 w-10 rounded-full cursor-pointer"
          onClick={handleSenderClick}
        >
          <AvatarFallback className="bg-orange-500 text-white text-lg font-semibold">
            {senderInitial}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-bold">{newsletter.title}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span 
              className="font-medium text-gray-700 cursor-pointer hover:underline"
              onClick={handleSenderClick}
            >
              {newsletter.sender || newsletter.brand_name}
            </span>
            <span className="mx-2">•</span>
            <span>{getFormattedDate(newsletter.published_at)}</span>
            
            {newsletter.categories && (
              <>
                <span className="mx-2">•</span>
                <span 
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ 
                    backgroundColor: newsletter.categories.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                    color: newsletter.categories.color || '#8B5CF6' 
                  }}
                >
                  {newsletter.categories.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterMeta;
