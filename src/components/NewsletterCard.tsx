
import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { saveNewsletter, unsaveNewsletter, isNewsletterSaved } from "@/lib/supabase";

interface NewsletterProps {
  id: number;
  title: string;
  sender: string;
  brand_name?: string;
  industry: string;
  preview: string;
  date: Date;
}

const NewsletterCard = ({ 
  id, 
  title, 
  sender, 
  brand_name,
  industry, 
  preview, 
  date
}: NewsletterProps) => {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  
  // Get display name (brand name if available, otherwise sender)
  const displayName = brand_name || sender;
  
  useEffect(() => {
    // Check if this newsletter is saved for the current user
    const checkSavedStatus = async () => {
      if (user) {
        try {
          const isSaved = await isNewsletterSaved(id, user.id);
          setSaved(isSaved);
        } catch (error) {
          console.error("Error checking saved status:", error);
        }
      }
    };
    
    checkSavedStatus();
  }, [user, id]);
  
  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save newsletters", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth?mode=signin"),
        },
      });
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
    
    try {
      setIsSaving(true);
      
      if (!saved) {
        await saveNewsletter(id, user.id);
        toast.success("Newsletter saved to your collection");
      } else {
        await unsaveNewsletter(id, user.id);
        toast.info("Newsletter removed from your collection");
      }
      
      setSaved(!saved);
    } catch (error) {
      toast.error("Failed to update saved status");
      console.error("Error updating saved status:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full h-full transition-all duration-300 hover:shadow-card overflow-hidden bg-dark-300 border-white/5">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div>
          <Badge className="mb-2 bg-dark-500 text-blue-400 hover:bg-dark-600">
            {industry}
          </Badge>
          <h3 className="text-lg font-medium line-clamp-1 text-white">{title}</h3>
          <p className="text-sm text-gray-500">
            From: {displayName}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8 text-gray-500 hover:text-white hover:bg-dark-400"
                disabled={isSaving}
              >
                {saved ? (
                  <BookmarkCheck className="h-5 w-5 text-blue-400" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-dark-400 border-white/10">
              <p>{saved ? "Remove from saved" : "Save newsletter"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-400 line-clamp-3">
          {preview}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-blue-400 hover:text-blue-400 hover:bg-blue-500/10"
        >
          <Mail className="mr-1 h-3 w-3" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsletterCard;
