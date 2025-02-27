
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, BookmarkCheck, Mail } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface NewsletterProps {
  id: string;
  title: string;
  sender: string;
  industry: string;
  preview: string;
  date: Date;
  isPremium?: boolean;
}

const NewsletterCard = ({ 
  id, 
  title, 
  sender, 
  industry, 
  preview, 
  date,
  isPremium = false
}: NewsletterProps) => {
  const [saved, setSaved] = useState(false);
  
  // Mock authentication state - would be replaced with real auth
  const isAuthenticated = false;

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save newsletters");
      return;
    }
    
    if (!isPremium) {
      toast("Premium Feature", {
        description: "Saving newsletters is a premium feature",
        action: {
          label: "Upgrade",
          onClick: () => console.log("Upgrade clicked"),
        },
      });
      return;
    }
    
    setSaved(!saved);
    if (!saved) {
      toast.success("Newsletter saved to your collection");
    } else {
      toast.info("Newsletter removed from your collection");
    }
  };

  return (
    <Card className="w-full h-full transition-all duration-300 hover:shadow-card overflow-hidden">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div>
          <Badge className="mb-2 bg-secondary text-secondary-foreground">
            {industry}
          </Badge>
          <h3 className="text-lg font-medium line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            From: {sender}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                {saved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{saved ? "Remove from saved" : "Save newsletter"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {preview}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-primary hover:text-primary hover:bg-mint-light"
        >
          <Mail className="mr-1 h-3 w-3" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsletterCard;
