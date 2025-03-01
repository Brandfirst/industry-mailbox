
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X, Mail, Calendar, UserCircle, Tag } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-2 border-b space-y-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold">
              {newsletter.title || "Untitled Newsletter"}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4 mr-1" /> 
              From: <span className="font-medium ml-1">{newsletter.sender || newsletter.sender_email || "Unknown sender"}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" /> 
              <span>{formattedDate}</span>
            </div>
            
            {(newsletter.industry || category) && (
              <div className="flex items-center gap-2 pt-1">
                {newsletter.industry && (
                  <Badge variant="secondary" className="text-xs">
                    {newsletter.industry}
                  </Badge>
                )}
                
                {category && (
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: category.color || '#666666', 
                      color: category.color || '#666666'
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" /> 
                    {category.name}
                  </Badge>
                )}
              </div>
            )}
            
            {newsletter.preview && (
              <DialogDescription className="text-sm mt-2 line-clamp-2">
                {newsletter.preview}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-auto flex-1 h-[calc(90vh-180px)]">
          {newsletter.content ? (
            <iframe
              srcDoc={newsletter.content}
              title={newsletter.title || "Newsletter Content"}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p>No content available for this newsletter.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
