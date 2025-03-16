
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getSenderPath, getNewsletterPath } from "@/lib/utils/newsletterNavigation";
import { Newsletter } from "@/lib/supabase/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to navigate to a newsletter detail page
 * @param email The email/newsletter object
 * @param navigate React Router navigate function
 * @param onComplete Optional callback after navigation
 * @returns A function that handles the navigation
 */
export const createNewsletterNavigationHandler = (
  email: any, 
  navigate: ReturnType<typeof useNavigate>,
  onComplete?: () => void
) => {
  return async (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Navigation handler called with email:", email);
    
    // Find the best ID to use - check for both id and newsletter_id
    const newsletterId = email.id || email.newsletter_id;
    
    if (newsletterId) {
      console.log(`Navigating to newsletter ID: ${newsletterId}`);
      
      // Direct navigation to the public newsletter detail page (not admin)
      navigate(`/newsletter/${newsletterId}`);
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete();
      }
    } else if (email.sender_email) {
      // Try to find the most recent newsletter from this sender first
      console.log(`Attempting to find a newsletter from sender: ${email.sender_email}`);
      
      try {
        const { data: newsletters, error } = await supabase
          .from('newsletters')
          .select('*')
          .eq('sender_email', email.sender_email)
          .order('published_at', { ascending: false })
          .limit(1);
          
        if (newsletters && newsletters.length > 0) {
          const latestNewsletter = newsletters[0];
          console.log(`Found newsletter with ID: ${latestNewsletter.id} from sender: ${email.sender_email}`);
          
          // Direct navigation to the found newsletter (public route)
          navigate(`/newsletter/${latestNewsletter.id}`);
          
          // Call the completion callback if provided
          if (onComplete) {
            onComplete();
          }
          return;
        } else {
          console.log(`No newsletters found for sender: ${email.sender_email}`);
        }
      } catch (error) {
        console.error("Error finding newsletters for sender:", error);
      }
      
      // If we get here, we couldn't find a specific newsletter, so fall back to sender page
      console.log(`Navigating to sender page for: ${email.sender_email}`);
      
      toast.info(`Showing all newsletters from ${email.sender_email}`, {
        description: "The specific newsletter couldn't be found, showing all from this sender instead."
      });
      
      // Navigate to public sender search page with sender filter
      if (email.sender) {
        navigate(`/sender/${email.sender}`);
      } else {
        navigate(`/search?sender=${encodeURIComponent(email.sender_email)}`);
      }
      
      if (onComplete) {
        onComplete();
      }
    } else {
      console.warn("Cannot navigate: email has no valid ID or sender", email);
      toast.error("Cannot view newsletter - no ID available");
    }
  };
};
