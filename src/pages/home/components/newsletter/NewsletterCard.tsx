
import { format } from 'date-fns';

interface NewsletterCardProps {
  newsletter: any;
  onClick: (newsletter: any) => void;
}

const NewsletterCard = ({ newsletter, onClick }: NewsletterCardProps) => {
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d');
  };

  return (
    <div 
      onClick={() => onClick(newsletter)}
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border flex flex-col h-[500px] hover:shadow-md transition-shadow"
    >
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
      </div>
      
      <div className="relative flex-1 w-full overflow-hidden">
        {newsletter.content ? (
          <div 
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            <iframe
              srcDoc={`
                <html>
                  <head>
                    <style>
                      html, body {
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        height: 100%;
                        width: 100%;
                      }
                      body {
                        zoom: 0.5;
                        -moz-transform: scale(0.5);
                        -moz-transform-origin: 0 0;
                        -o-transform: scale(0.5);
                        -o-transform-origin: 0 0;
                        -webkit-transform: scale(0.5);
                        -webkit-transform-origin: 0 0;
                        transform: scale(0.5);
                        transform-origin: 0 0;
                      }
                      a {
                        pointer-events: none;
                      }
                      * {
                        max-width: 100%;
                        box-sizing: border-box;
                      }
                    </style>
                  </head>
                  <body>${newsletter.content}</body>
                </html>
              `}
              title={newsletter.title || "Newsletter Content"}
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
              style={{ 
                height: "200%",
                width: "200%",
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">No content available</p>
          </div>
        )}
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            onClick(newsletter);
          }}
          aria-label={`View ${newsletter.title || 'newsletter'} details`}
        />
      </div>
    </div>
  );
};

export default NewsletterCard;
