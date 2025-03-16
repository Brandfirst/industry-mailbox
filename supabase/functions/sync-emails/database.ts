
import { removeTrackingElements } from './content.ts';

// Function to save an email to the database
export async function saveEmailToDatabase(email, accountId, supabase, verbose = false) {
  try {
    // Check if email already exists to avoid duplicates
    if (verbose) {
      console.log(`Checking if email ${email.id} already exists...`);
    }
    
    const { data: existingData } = await supabase
      .from('newsletters')
      .select('id')
      .eq('email_id', accountId)
      .eq('gmail_message_id', email.id)
      .maybeSingle();
    
    if (existingData) {
      if (verbose) {
        console.log(`Email ${email.id} already exists, skipping`);
      }
      return null;
    }
    
    // Prepare email data for saving
    const emailData = {
      email_id: accountId,
      gmail_message_id: email.id,
      gmail_thread_id: email.threadId,
      title: email.subject,
      sender_email: email.sender_email,
      sender: email.sender,
      content: email.html || email.snippet || '',
      published_at: email.date,
      preview: email.snippet || '',
    };
    
    if (verbose) {
      console.log(`Inserting email:`, {
        id: email.id,
        title: emailData.title,
        sender: emailData.sender
      });
    }
    
    // Pre-process content to remove tracking elements but preserve legitimate images
    if (emailData.content) {
      emailData.content = removeTrackingElements(emailData.content);
      
      // Convert all image URLs to HTTPS for security
      emailData.content = emailData.content.replace(
        /(<img[^>]*src=["'])http:\/\/([^"']+["'][^>]*>)/gi, 
        '$1https://$2'
      );
      
      // Fix base64 encoded images if present (ensure they have proper formatting)
      emailData.content = emailData.content.replace(
        /(<img[^>]*src=["'])data:image\/([^;]+);base64,\s*/gi,
        '$1data:image/$2;base64,'
      );
      
      if (verbose) {
        console.log('Content processed: removed tracking elements, preserved legitimate images');
        
        // Count images after processing
        const imgTagCount = (emailData.content.match(/<img[^>]*>/gi) || []).length;
        console.log(`Number of image tags after processing: ${imgTagCount}`);
      }
    }
    
    // Insert email into database
    const { data, error } = await supabase
      .from('newsletters')
      .insert(emailData)
      .select()
      .single();
    
    if (error) {
      console.error(`Error saving email ${email.id}:`, error);
      throw error;
    }
    
    if (verbose) {
      console.log(`Saved email: ${data.title}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error processing email ${email.id}:`, error);
    throw error;
  }
}
