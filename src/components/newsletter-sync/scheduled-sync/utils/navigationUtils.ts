
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getSenderPath, getNewsletterPath } from "@/lib/utils/newsletterNavigation";

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
      
      // Create a SEO-friendly path for the newsletter
      // If we have sender info, create a slug from it
      const senderSlug = email.sender_email ? 
        email.sender_email.toLowerCase().replace('@', '-').replace(/\./g, '') : 
        'unknown';
      
      // Create a slug for the title or subject
      const titleSlug = email.title || email.subject || 'untitled';
      
      // Construct the full path using format: /{sender-slug}/{title-slug}-{id}
      const path = `/${senderSlug}/${titleSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${newsletterId}`;
      
      console.log(`Using SEO-friendly path: ${path}`);
      navigate(path);
      
      // Call the completion callback if provided
      if (onComplete) {
        onComplete();
      }
    } else if (email.sender_email) {
      // If we have a sender email but no ID, navigate to the sender's page instead
      console.log(`Navigating to sender: ${email.sender_email}`);
      const senderPath = getSenderPath(email.sender_email);
      
      toast.info(`Showing all newsletters from ${email.sender_email}`, {
        description: "The specific newsletter couldn't be found, showing all from this sender instead."
      });
      
      navigate(senderPath);
      
      if (onComplete) {
        onComplete();
      }
    } else {
      console.warn("Cannot navigate: email has no valid ID or sender", email);
      toast.error("Cannot view newsletter - no ID available");
    }
  };
};
