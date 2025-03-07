
import { format } from 'date-fns';
import { Newsletter } from "@/lib/supabase/types";
import { useNavigate } from "react-router-dom";
import { navigateToSender } from "@/lib/utils/newsletterNavigation";

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
    navigateToSender(newsletter.sender || '', navigate, e);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div 
          className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 cursor-pointer"
          onClick={handleSenderClick}
        >
          {newsletter.sender && (
            <span className="text-lg font-semibold text-gray-700">
              {newsletter.sender.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{newsletter.title}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span 
              className="font-medium text-gray-700 cursor-pointer hover:underline"
              onClick={handleSenderClick}
            >
              {newsletter.sender}
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
