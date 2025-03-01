
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X, Mail, Calendar, UserCircle, Tag, MapPin, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

type NewsletterViewDialogProps = {
  newsletter: Newsletter;
};

export function NewsletterViewDialog({ newsletter }: NewsletterViewDialogProps) {
  // Format the date if it exists
  const formattedDate = newsletter.published_at 
    ? formatDistanceToNow(new Date(newsletter.published_at), { addSuffix: true })
    : "Unknown date";

  // Get category info if available
  const category = newsletter.categories as NewsletterCategory | null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden border-gray-200 shadow-lg">
        <DialogHeader className="pb-2 border-b border-gray-200 space-y-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              {newsletter.title || "Untitled Newsletter"}
            </DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <UserCircle className="h-4 w-4 mr-1" /> 
              <span className="font-medium">From:</span>
              <span className="ml-1">{newsletter.sender || newsletter.sender_email || "Unknown sender"}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 mr-1" /> 
              <span className="font-medium">Date:</span>
              <span className="ml-1">{formattedDate}</span>
            </div>
            
            {newsletter.industry && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 mr-1" /> 
                <span className="font-medium">Industry:</span>
                <span className="ml-1">{newsletter.industry}</span>
              </div>
            )}
            
            {(newsletter.industry || category) && (
              <div className="flex items-center gap-2 pt-1">
                {newsletter.industry && (
                  <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    {newsletter.industry}
                  </Badge>
                )}
                
                {category && (
                  <Badge 
                    variant="outline" 
                    className="text-xs font-medium"
                    style={{ 
                      backgroundColor: `${category.color}10` || '#f3f4f6',
                      borderColor: category.color || '#9ca3af', 
                      color: category.color || '#6b7280'
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" /> 
                    {category.name}
                  </Badge>
                )}
                
                {newsletter.sender_email && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    <Mail className="h-3 w-3 mr-1" />
                    {newsletter.sender_email}
                  </Badge>
                )}
              </div>
            )}
            
            {newsletter.preview && (
              <DialogDescription className="text-sm mt-2 line-clamp-2 text-gray-700 dark:text-gray-300">
                {newsletter.preview}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-auto flex-1 h-[calc(90vh-220px)] bg-white dark:bg-gray-800 rounded-b-md">
          {newsletter.content ? (
            <iframe
              srcDoc={newsletter.content}
              title={newsletter.title || "Newsletter Content"}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">No content available for this newsletter.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
