
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  return (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Navigation handler called with email:", email);
    
    // Find the best ID to use
    const newsletterId = email.id || email.newsletter_id;
    
    if (newsletterId) {
      console.log(`Navigating to newsletter ID: ${newsletterId}`);
      navigate(`/newsletter/${newsletterId}`);
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete();
      }
    } else {
      console.warn("Cannot navigate: email has no valid ID", email);
      toast.error("Cannot view newsletter - no ID available");
    }
  };
};
